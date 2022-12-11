import React from 'react';
import { Avatar } from '@arco-design/web-react';
import { Popover } from '@arco-design/web-react';
import "@arco-design/web-react/dist/css/arco.css";
const AvatarGroup = Avatar.Group;

function Maintainer(props): JSX.Element {
    const data = [
        {
            name: 'anqiansong',
            img: "https://avatars.githubusercontent.com/u/10302073?v=4",
        },
        {
            name: 'zhoushuguang',
            img: "https://avatars.githubusercontent.com/u/16539942?v=4",
        },
        {
            name: 're-dylan',
            img: "https://avatars.githubusercontent.com/u/35103941?v=4",
        },
        {
            name: 'Mikaelemmmm',
            img: "https://avatars.githubusercontent.com/u/74481083?v=4",
        },
        {
            name: 'MarkJoyMa',
            img: "https://avatars.githubusercontent.com/u/64180138?v=4",
        },
        {
            name: 'jsonMark',
            img: "https://avatars.githubusercontent.com/u/27055049?v=4",
        }
    ]
    return (
        <div>
            <AvatarGroup
                size={48}
                style={{ margin: 10 }}
            >
                {data.map((item, index) => {
                    return (
                        <Popover position='tl' title='' content={item.name} key={item.name}>
                            <a href={"https://github.com/" + item.name}>
                                <Avatar>
                                    <img src={item.img} alt={item.name} />
                                </Avatar>
                            </a>
                        </Popover>
                    )
                })}
            </AvatarGroup>
        </div>
    )
}

export default Maintainer;