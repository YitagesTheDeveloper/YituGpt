import axios from "axios"
import Chat from "../models/Chat.js"
import User from "../models/user.js"
import imagekit from "../configs/imageKit.js"
import openai from "../configs/openai.js"


// Text based AI Chat Message Controller
export const textMessageController = async(req,res)=>{
    try {
        const userId = req.user._id

        // Check credits
        if(req.user.credits < 1){
            return res.json({success:false,message:"You don't have enough credits to use this feature"})
        }

        const {chatId,prompt} = req.body
        const chat = await Chat.findOne({userId,_id:chatId})
        chat.messages.push({role:"user",content:prompt,timestamp:Date.now(),isImage:false})

        const model = process.env.GEMINI_MODEL || "gemini-2.5-flash"
        console.log('Calling OpenAI client', { model, baseURL: openai?.baseURL || '(default)' })

        const {choices} = await openai.chat.completions.create({
            model,
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });
        const reply = {...choices[0].message, timestamp:Date.now(),isImage:false }
        res.json({success:true,reply})

        chat.messages.push(reply)
        await chat.save()
        await User.updateOne({_id:userId},{$inc:{credits: -1}})
        
    } catch (error) {
       console.error('textMessageController error:', error)
       const status = error?.status || error?.response?.status || null
       const body = error?.response?.data || error?.body || null
       res.status(status || 500).json({success:false,message:error.message, status, body})
    }
}

// Image generation message controller

export const imageMessageController = async(req,res)=>{
    try {
        const userId = req.user._id;
        // Check credits
        if(req.user.credits < 2){
            return res.json({success:false,message:"You don't have enough credits to use this feature"})
        }
        const {prompt,chatId, isPublished,} = req.body
        //Find chat
        const chat = await Chat.findOne({userId,_id:chatId})
        chat.messages.push({
            role:"user",
            content:prompt,
            timestamp:Date.now(),
            isImage:false});

            // Encode the prompt
            const encodedPrompt = encodeURIComponent(prompt)

            // Construct Image AI generation URL
            const generatedImageUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/YituGPT/${Date.now()}.png?tr=w-800 h-800`;
             const aiImageResponse = await axios.get(generatedImageUrl,{responseType:"arraybuffer"})

            //  Covert to base 64
            const base64Image = `data:image/png;base64,${Buffer.from(aiImageResponse.data,"binary").toString('base64')}`;

            // upload to ImageKit media library (use SDK's files.upload)
            if (!imagekit?.files || typeof imagekit.files.upload !== 'function') {
                console.error('ImageKit client missing files.upload method or imagekit is misconfigured')
                throw new Error('ImageKit client not configured correctly')
            }

            const uploadResponse = await imagekit.files.upload({
                file: base64Image,
                fileName: `${Date.now()}.png`,
                folder: 'YituGPT',
            })

            const reply = {
                role: 'assistant',
                content: uploadResponse.url,
                timestamp: Date.now(),
                isImage: true,
                isPublished,
            }

        res.json({success:true,reply})

        chat.messages.push(reply)
        await chat.save()
        await User.updateOne({_id:userId},{$inc:{credits:-2}})


    } catch (error) {
        console.error('imageMessageController error:', error)
        const status = error?.status || error?.response?.status || null
        const body = error?.response?.data || error?.body || null
        res.status(status || 500).json({success:false,message:error.message, status, body}) 
    }
}

// API to get published images










