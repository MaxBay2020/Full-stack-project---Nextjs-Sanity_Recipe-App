import {sanityClient} from "../../lib/sanity.server";
import {urlFor,usePreviewSubscription, PortableText} from "../../lib/sanity"

// 查找指定的slug名称的recipe，返回的是只有一个元素的数组，并取得指定的字段
const recipeQuery=`*[_type=='recipe' && slug.current == $slug][0]{
    _id,
    name,
    mainImage,
    ingredient[]{
        _key, unit, wholeNumber, fraction, ingredient->{name}
    },
    instructions,
    likes
}`

import React, {useState} from 'react';
import axios from 'axios'
import {useRouter} from "next/router";

const oneRecipe = ({data, preview}) => {

    const router = useRouter()
    if(router.isFallback){
        return (
            <div>Loading...</div>
        )
    }

    // const {data: recipe}=usePreviewSubscription(recipeQuery, {
    //     params: { slug: data.recipe?.slug.current },
    //     initialData: data,
    //     enabled: preview,
    // })


    const [likes, setLikes]=useState(data?.recipe?.likes)

    const addLike = async ()=>{
        const res = await axios.post('/api/handle-like', {_id: recipe._id})
        if(res.status===200){
            setLikes(res.likes)
        }
    }

    const {recipe}=data

    return (
        <article className='recipe'>
            <h1>{recipe.name}</h1>

            <button className='like-button' onClick={()=>addLike()}>
                {likes} ❤️
            </button>

            <main className='content'>
                <img src={urlFor(recipe?.mainImage).url()} alt={recipe.name}/>
                <div className='breakdown'>
                    <ul className='ingredients'>
                        {recipe.ingredient?.map(ingredient => (
                            <li key={ingredient._key} className='ingredient'>
                                {ingredient?.wholeNumber}
                                {ingredient?.fraction}
                                {' '}
                                {ingredient?.unit}
                                <br/>
                                {ingredient?.ingredient?.name}
                            </li>
                        ))
                        }
                    </ul>
                    {/*PortableText会将block文字转换成react组件d\；value中的值会显示在页面上*/}
                    <PortableText value={recipe.instructions} className='instructions' />
                </div>
            </main>
        </article>
    );
};

export const getStaticProps = async ({params})=>{
    const {slug}=params
    // 第二个参数替换recipeQuery中的$slug
    const recipe = await sanityClient.fetch(recipeQuery, {slug})
    return {
        props: {
            data: {
                recipe
            },
            preview: true
        }
    }
}

export const getStaticPaths = async (context)=>{
    const paths = await sanityClient.fetch(
        `*[_type=='recipe' && defined(slug.current) ]{
            'params': {
                'slug': slug.current
            }
        }`
    )

    return {
        paths,
        fallback: true
    }

}

export default oneRecipe;
