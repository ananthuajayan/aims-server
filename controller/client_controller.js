const clientModal = require('../model/client_modal');

const getAllClients = async(req,res)=>{
    try {
       const clients = await clientModal.getAllClients()
       console.log(clients)
       res.status(200).json(clients)
    } catch (error) {
        res.status(500).json(
        console.log(error)
        )
    }
}

const deleteClient = async(req,res)=>{
    const userId = req.params.id;
    try {
        const user = await clientModal.getClientById(userId)
        if(!user){
            return res.status(500).json({
                msg:"user cannot be found"
            })
        }
        const deletedClient = await clientModal.deleteClient(userId)
        if(deletedClient){
            res.status(200).json({msg:"user deleted sucessfully"})
        }
        else{
            res.status(201).json({msg:"failed to delete the client"})
        }
    } catch (error) {
      res.status(500).json({
       msg:message.error 
      })  
    }
}

const updateClient = async (req, res) => {
    const userId = req.params.id;
    const { client_contract_number, client_name, client_number, client_email_id, client_passport, client_contract_start_date, client_contract_end_date, client_insurance_status } = req.body;
    console.log(req.body);
    try {
        const existingUser = await clientModal.getClientById(userId);
        if (!existingUser) {
            return res.status(404).json({ msg: "User not found" });
        }
        const updatedClient = await clientModal.updateClient(userId, client_contract_number, client_name, client_number, client_email_id, client_passport, client_contract_start_date, client_contract_end_date, client_insurance_status);
        console.log(updatedClient)
        if (updatedClient) {
            console.log(updatedClient)
            res.status(200).json({ msg: "User updated successfully" });
        } else {
            res.status(500).json({ msg: "Failed to update user" });
        }
    } catch (error) {
        throw error;
    }
};

module.exports = {getAllClients,deleteClient,updateClient};