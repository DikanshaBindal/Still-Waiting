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

#[contract]
pub struct ReceiptTokenContract;

#[contractimpl]
impl ReceiptTokenContract {
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().persistent().has(&DataKey::Admin) {
            panic!("Already initialized");
        }
        env.storage().persistent().set(&DataKey::Admin, &admin);
        env.storage().persistent().set(&DataKey::Name, &String::from_str(&env, "StillWaitingReceiptToken"));
        env.storage().persistent().set(&DataKey::Symbol, &String::from_str(&env, "SWRT"));
    }

    pub fn mint(env: Env, to: Address) {
        // In a real scenario, we might check for admin authorization
        // admin.require_auth(); 
        // But for this simple proof-of-concept, we'll allow the store contract to call this.
        
        let key = DataKey::Balance(to.clone());
        let balance: i128 = env.storage().persistent().get(&key).unwrap_or(0);
        env.storage().persistent().set(&key, &(balance + 1));
    }

    pub fn balance(env: Env, account: Address) -> i128 {
        env.storage().persistent().get(&DataKey::Balance(account)).unwrap_or(0)
    }

    pub fn name(env: Env) -> String {
        env.storage().persistent().get(&DataKey::Name).unwrap()
    }

    pub fn symbol(env: Env) -> String {
        env.storage().persistent().get(&DataKey::Symbol).unwrap()
    }
}
