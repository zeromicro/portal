import {useLocation} from '@docusaurus/router';
import {usePluginData} from '@docusaurus/useGlobalData';
import OriginalTOC from '@theme-original/TOC';
import EditThisPage from '@theme/EditThisPage';
import React, {useEffect, useState} from 'react';
import {PrismicRichText} from '@prismicio/react';
import {prismicAds} from "./data"

export default function TOC({toc, editUrl, ...props}) {
    const [activeAd, setActiveAd] = useState<typeof prismicAds.list.data>();
    const location = useLocation();

    const isEmpty = toc.length <= 0;

    function getOr(path) {
        if (prismicAds.enable === false) {
            return null
        }
        for (let i = 0; i < prismicAds.list.length; i++) {
            const item = prismicAds.list[i]
            if (item.data.path === path) {
                if (item.data.disable === true) {
                    return null
                }
                return item.data
            }
        }

        let validAds = []
        prismicAds.list.forEach((item) => {
            if (item.data.disable === false) {
                validAds.push(item)
            }
        })

        return validAds[Math.floor(Math.random() * validAds.length)].data
    }

    useEffect(() => {
        setActiveAd(getOr(location.pathname));
    }, [location]);

    if (isEmpty) return null;

    return (
        <div className="toc-wrapper">
            <h2>Contents</h2>
            <OriginalTOC toc={toc} {...props} />
            {/*<EditThisPage editUrl={editUrl}/>*/}
            {activeAd && (
                <div className="doc-ad">
                    <a
                        href={activeAd.ad_url.url}
                        target={activeAd.ad_url.target}
                    >
                        <picture>
                            <source media="(min-width: 37.5em)" src={activeAd.ad_image.url}/>
                            <source src={activeAd.ad_image['1x'].url}/>
                            <img
                                src={activeAd.ad_image.url}
                                alt={activeAd.ad_image.alt}
                                height={activeAd.ad_image['1x'].dimensions.height}
                                width={activeAd.ad_image['1x'].dimensions.width}
                            />
                            <p>{activeAd.ad_image.alt}</p>
                        </picture>
                        <PrismicRichText field={activeAd.ad_copy}/>
                    </a>
                </div>
            )}
        </div>
    );
}
