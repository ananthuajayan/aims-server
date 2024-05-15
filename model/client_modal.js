var connection = require("../dbConnection");
var util = require("util");
var query = util.promisify(connection.query).bind(connection);


var getAllClients = async(client_email_id)=>{
    try {
        var mailQuery = "SELECT * FROM aims_client";
        var rows = await query(mailQuery,[client_email_id]);
        return rows  
    } catch (error) {
       throw error 
    }
}

var deleteClient = async(client_id)=>{
    try {
        var Query = "DELETE FROM aims_client WHERE client_id = ?" 
        var result =await query(Query,[client_id])
        return result;
    } catch (error) {
        throw(error)
    }
}

var getClientById =async(client_id)=>{
  try {
     var Query = "SELECT * FROM aims_client WHERE Client_id= ?"
     var result =await query(Query,[client_id])
     return result
  } catch (error) {
    throw error
  }
}

var updateClient = async (client_id, client_contract_number, client_name, client_number, client_email_id, client_passport, client_contract_start_date, client_contract_end_date, client_insurance_status, client_status) => {
    try {
        var Query = "UPDATE aims_client SET client_contract_number = ?, client_name = ?, client_number = ?, client_email_id = ?, client_passport = ?, client_contract_start_date = ?, client_contract_end_date = ?, client_insurance_status = ?, client_status = ? WHERE client_id = ?";
        var result = await query(Query, [client_contract_number, client_name, client_number, client_email_id, client_passport, client_contract_start_date, client_contract_end_date, client_insurance_status, client_status, client_id]);
        return result;
    } catch (error) {
        throw error;
    }
};

module.exports = {getAllClients,deleteClient,getClientById,updateClient};