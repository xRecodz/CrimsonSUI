/// Crimson Quest — DFQ token, Walrus-linked badge NFT, staking pool (Sui testnet/mainnet).
module crimson_quest::crimson {
    use std::option;
    use std::string::{Self, String};
    use sui::balance::{Self, Balance};
    use sui::clock::{Self, Clock};
    use sui::coin::{Self, Coin, TreasuryCap};
    use sui::event;
    use sui::object;
    use sui::table::{Self, Table};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    // ─── One-time witness (must match module name: CRIMSON) ───
    public struct CRIMSON has drop {}

    // ─── Shared objects (created in init) ───
    public struct Faucet has key {
        id: UID,
        treasury: TreasuryCap<CRIMSON>,
        last_claim: Table<address, u64>,
    }

    public struct BadgeRegistry has key {
        id: UID,
        mint_fee: u64,
        treasury: address,
        next_badge_id: u64,
    }

    public struct StakingPool has key {
        id: UID,
        min_stake: u64,
        vault: Balance<CRIMSON>,
        stakes: Table<address, u64>,
    }

    /// On-chain badge object; metadata URI points to Walrus (walrus:// or https://aggregator...).
    public struct QuestBadge has key, store {
        id: UID,
        badge_id: u64,
        walrus_uri: String,
        owner: address,
        minted_at_ms: u64,
    }

    // ─── Events ───
    public struct FaucetClaimed has copy, drop {
        recipient: address,
        amount: u64,
    }

    public struct BadgeMinted has copy, drop {
        owner: address,
        badge_id: u64,
        walrus_uri: String,
        fee_paid: u64,
    }

    public struct Staked has copy, drop {
        user: address,
        amount: u64,
        total_staked: u64,
    }

    public struct Unstaked has copy, drop {
        user: address,
        amount: u64,
        total_staked: u64,
    }

    // ─── Constants (9 decimals) ───
    const FAUCET_AMOUNT: u64 = 1_000_000_000_000; // 1000 DFQ
    const FAUCET_COOLDOWN_MS: u64 = 43_200_000; // 12 hours
    const DEFAULT_MINT_FEE: u64 = 50_000_000_000; // 50 DFQ
    const DEFAULT_MIN_STAKE: u64 = 10_000_000_000; // 10 DFQ

    const E_FAUCET_COOLDOWN: u64 = 1;
    const E_INSUFFICIENT_PAYMENT: u64 = 2;
    const E_BELOW_MIN_STAKE: u64 = 3;
    const E_INSUFFICIENT_STAKE: u64 = 4;

    fun init(otw: CRIMSON, ctx: &mut TxContext) {
        let (treasury, metadata) = coin::create_currency(
            otw,
            9,
            b"DFQ",
            b"DeFi Quest Token",
            b"Crimson in-app token for quests on Sui",
            option::none(),
            ctx,
        );
        transfer::public_freeze_object(metadata);

        let sender = tx_context::sender(ctx);

        let faucet = Faucet {
            id: object::new(ctx),
            treasury,
            last_claim: table::new(ctx),
        };
        transfer::share_object(faucet);

        let registry = BadgeRegistry {
            id: object::new(ctx),
            mint_fee: DEFAULT_MINT_FEE,
            treasury: sender,
            next_badge_id: 0,
        };
        transfer::share_object(registry);

        let pool = StakingPool {
            id: object::new(ctx),
            min_stake: DEFAULT_MIN_STAKE,
            vault: balance::zero(),
            stakes: table::new(ctx),
        };
        transfer::share_object(pool);
    }

    /// Claim 1000 DFQ from faucet (12h cooldown per address).
    public entry fun claim_faucet(
        faucet: &mut Faucet,
        clock: &Clock,
        ctx: &mut TxContext,
    ) {
        let sender = tx_context::sender(ctx);
        let now = clock::timestamp_ms(clock);

        if (table::contains(&faucet.last_claim, sender)) {
            let last = *table::borrow(&faucet.last_claim, sender);
            assert!(now >= last + FAUCET_COOLDOWN_MS, E_FAUCET_COOLDOWN);
            let _ = table::remove(&mut faucet.last_claim, sender);
        };

        table::add(&mut faucet.last_claim, sender, now);
        coin::mint_and_transfer(
            &mut faucet.treasury,
            FAUCET_AMOUNT,
            sender,
            ctx,
        );

        event::emit(FaucetClaimed {
            recipient: sender,
            amount: FAUCET_AMOUNT,
        });
    }

    /// Mint badge NFT; pays DFQ fee to treasury. `walrus_uri` should be walrus://blobId or aggregator URL.
    public entry fun mint_badge(
        registry: &mut BadgeRegistry,
        mut payment: Coin<CRIMSON>,
        walrus_uri: vector<u8>,
        ctx: &mut TxContext,
    ) {
        let fee = registry.mint_fee;
        let paid = coin::value(&payment);
        assert!(paid >= fee, E_INSUFFICIENT_PAYMENT);

        let fee_coin = coin::split(&mut payment, fee, ctx);
        transfer::public_transfer(fee_coin, registry.treasury);

        let change = coin::value(&payment);
        if (change > 0) {
            transfer::public_transfer(payment, tx_context::sender(ctx));
        } else {
            coin::destroy_zero(payment);
        };

        let badge_id = registry.next_badge_id;
        registry.next_badge_id = badge_id + 1;

        let uri = string::utf8(walrus_uri);
        let owner = tx_context::sender(ctx);
        let minted_at_ms = tx_context::epoch_timestamp_ms(ctx);

        event::emit(BadgeMinted {
            owner,
            badge_id,
            walrus_uri: uri,
            fee_paid: fee,
        });

        let badge = QuestBadge {
            id: object::new(ctx),
            badge_id,
            walrus_uri: uri,
            owner,
            minted_at_ms,
        };

        transfer::transfer(badge, owner);
    }

    /// Stake DFQ into the shared pool (bonus quest).
    public entry fun stake(
        pool: &mut StakingPool,
        payment: Coin<CRIMSON>,
        ctx: &mut TxContext,
    ) {
        let sender = tx_context::sender(ctx);
        let amount = coin::value(&payment);
        assert!(amount >= pool.min_stake, E_BELOW_MIN_STAKE);

        balance::join(&mut pool.vault, coin::into_balance(payment));

        let total = if (table::contains(&pool.stakes, sender)) {
            *table::borrow(&pool.stakes, sender) + amount
        } else {
            amount
        };

        if (table::contains(&pool.stakes, sender)) {
            let entry = table::borrow_mut(&mut pool.stakes, sender);
            *entry = total;
        } else {
            table::add(&mut pool.stakes, sender, total);
        };

        event::emit(Staked {
            user: sender,
            amount,
            total_staked: total,
        });
    }

    /// Unstake DFQ from the pool.
    public entry fun unstake(
        pool: &mut StakingPool,
        amount: u64,
        ctx: &mut TxContext,
    ) {
        let sender = tx_context::sender(ctx);
        assert!(table::contains(&pool.stakes, sender), E_INSUFFICIENT_STAKE);

        let staked = table::borrow(&pool.stakes, sender);
        assert!(*staked >= amount, E_INSUFFICIENT_STAKE);

        let remaining = *staked - amount;
        if (remaining == 0) {
            let _ = table::remove(&mut pool.stakes, sender);
        } else {
            let entry = table::borrow_mut(&mut pool.stakes, sender);
            *entry = remaining;
        };

        let coin_out = coin::from_balance(
            balance::split(&mut pool.vault, amount),
            ctx,
        );
        transfer::public_transfer(coin_out, sender);

        event::emit(Unstaked {
            user: sender,
            amount,
            total_staked: remaining,
        });
    }

    // ─── View helpers ───
    public fun mint_fee(registry: &BadgeRegistry): u64 {
        registry.mint_fee
    }

    public fun min_stake(pool: &StakingPool): u64 {
        pool.min_stake
    }

    public fun staked_balance(pool: &StakingPool, user: address): u64 {
        if (table::contains(&pool.stakes, user)) {
            *table::borrow(&pool.stakes, user)
        } else {
            0
        }
    }
}
