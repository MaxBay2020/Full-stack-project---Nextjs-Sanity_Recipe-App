import {
    createPreviewSubscriptionHook,
    createCurrentUserHook
} from 'next-sanity'
import { PortableText as PortableTextComponent } from '@portabletext/react'

import createImageUrlBuilder from '@sanity/image-url'
import {config} from './config'


export const urlFor= (source) => createImageUrlBuilder(config).image(source)
export const usePreviewSubscription = createPreviewSubscriptionHook(config)
export const useCurrentUser = createCurrentUserHook(config)
export const PortableText = (props) => <PortableTextComponent components={{}} {...props} />
