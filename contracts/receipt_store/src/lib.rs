#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String};

#[contracttype]
#[derive(Clone)]
pub struct Receipt {
    pub receipt_id: String,
    pub wallet: Address,
    pub amount: i128,
    pub timestamp: u64,
}

#[contract]
pub struct ReceiptStoreContract;

#[contracttype]
#[derive(Clone)]
pub enum StoreDataKey {
    TokenContract,
}

#[contractimpl]
impl ReceiptStoreContract {
    pub fn set_token_contract(env: Env, token_contract: Address) {
        env.storage().persistent().set(&StoreDataKey::TokenContract, &token_contract);
    }

    pub fn create_receipt(
        env: Env,
        receipt_id: String,
        wallet: Address,
        amount: i128,
        timestamp: u64,
    ) {
        let receipt = Receipt {
            receipt_id: receipt_id.clone(),
            wallet: wallet.clone(),
            amount,
            timestamp,
        };
        env.storage().persistent().set(&receipt_id, &receipt);

        // Inter-contract call to mint token
        if let Some(token_contract) = env.storage().persistent().get::<StoreDataKey, Address>(&StoreDataKey::TokenContract) {
            let _: () = env.invoke_contract(&token_contract, &soroban_sdk::symbol_short!("mint"), soroban_sdk::vec![&env, wallet.into_val(&env)]);
        }
    }

    pub fn get_token_contract(env: Env) -> Option<Address> {
        env.storage().persistent().get(&StoreDataKey::TokenContract)
    }
}
