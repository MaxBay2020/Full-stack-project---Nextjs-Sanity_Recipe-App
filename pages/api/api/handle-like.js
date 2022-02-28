import {sanityClient} from "../../lib/sanity.server";

sanityClient.config({
    // 这个是从manage.sanity.io上申请的api token
    token: process.env.SANITY_WRITE_TOKEN,

})

export const likeButtonHandler = async (req,res)=>{
    const {_id}=req.body
    // 找到指定_id的那个recipe
    const data=await sanityClient
        .patch(_id) // 找到指定的那个recipe
        .setIfMissing({likes: 0}) // 如果没有likes，则赋值为0
        .inc({likes: 1}) // 点击like按钮，加1
        .commit() // 确认提交
        .catch(error => console.log(error.message)) // 异常捕获

    res.status(200).send({likes: data.likes})
}

export default likeButtonHandler
