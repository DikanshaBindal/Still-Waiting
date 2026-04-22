#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String, symbol_short, Symbol};

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admin,
    Name,
    Symbol,
    Balance(Address),
}

/// ReceiptTokenContract is a simplified Soroban token contract representing 
/// a digital proof of purchase for the Still-Waiting checkout system.
#[contract]
pub struct ReceiptTokenContract;

#[contractimpl]
impl ReceiptTokenContract {
    /// Initializes the token contract with an administrator and default metadata.
    /// Panics if the contract has already been initialized.
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().persistent().has(&DataKey::Admin) {
            panic!("Receipt Token Contract already initialized");
        }
        env.storage().persistent().set(&DataKey::Admin, &admin);
        env.storage().persistent().set(&DataKey::Name, &String::from_str(&env, "StillWaitingReceiptToken"));
        env.storage().persistent().set(&DataKey::Symbol, &String::from_str(&env, "SWRT"));
    }

    /// Mints 1 receipt token (SWRT) to the specified address.
    /// In this simplified version, authorization checks are skipped for demonstration
    /// purposes but should be managed by the ReceiptStore in production.
    pub fn mint(env: Env, to: Address) {
        let key = DataKey::Balance(to.clone());
        let balance: i128 = env.storage().persistent().get(&key).unwrap_or(0);
        env.storage().persistent().set(&key, &(balance + 1));
    }

    /// Returns the SWRT balance for a given account.
    pub fn balance(env: Env, account: Address) -> i128 {
        env.storage().persistent().get(&DataKey::Balance(account)).unwrap_or(0)
    }

    /// Returns the human-readable name: StillWaitingReceiptToken
    pub fn name(env: Env) -> String {
        env.storage().persistent().get(&DataKey::Name).unwrap()
    }

    /// Returns the token symbol: SWRT
    pub fn symbol(env: Env) -> String {
        env.storage().persistent().get(&DataKey::Symbol).unwrap()
    }
}
