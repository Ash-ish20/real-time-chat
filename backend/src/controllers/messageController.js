import Message from "../models/messageModel.js"
import User from "../models/userModel.js"

export const getUserForSidebar =  async (req, res) =>{
    try {
        const loggedInUserId = req.user._id
        const filteredUsers = await User.find({_id: {$ne: loggedInUserId}}).select('-password')
        res.status(200).json({
            success:true,
            users: filteredUsers
        })
    } catch (error) {
        console.log("error in getUserForSidebar:", error);
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}


export const getMessages = async (req, res) =>{
    try {
        const {id: userToChatId} =  req.params;
        const myId = req.user._id
        const messages =  await Message.find({
            $or: [
                { sender: myId, receiver: userToChatId },
                { sender: userToChatId, receiver: myId }
            ]
        })
        res.status(200).json({
            success:true,
            messages
        })
    } catch (error) {
        console.log("error in getMessages:", error);
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

export const sendMessage = async (req, res) =>{
    try {
        const {text, image  } = req.body;
        const {id: receiverId} = req.params;
        const senderId = req.user._id
        let imageUrl;
        if(image){
            const uploadRes = await cloudinary.uploader.upload(image);
            imageUrl = uploadRes.secure_url;
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })

        await newMessage.save()

        //real time functionality comes below using socket io

        res.status(201).json({newMessage})

    } catch (error) {
        console.log("error in sendMessage:", error);
        res.status(500).json({
            success:false,
            message:error.message
        })
        
    }
}