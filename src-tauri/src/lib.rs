use std::env;
use dotenv::dotenv;

#[tauri::command]
fn get_env_var(name: String) -> String {
    dotenv().ok();
    match env::var(&name) {
        Ok(value) => {
            value
        }
        Err(_) => {
            "ERROR".to_string()
        }
    }
}

#[tauri::command]
fn import_qr_code(code: String) {
    println!("QR Code imported: {}", code);
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![get_env_var, import_qr_code])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
