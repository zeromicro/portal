import React from 'react';
import { Avatar, Space } from '@arco-design/web-react';
import { Popover } from '@arco-design/web-react';
import "@arco-design/web-react/dist/css/arco.css";
const AvatarGroup = Avatar.Group;

function Contributors(props): JSX.Element {
    const contributos = [
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
            <Space size='small'>
                {contributos.map((item, index) => {
                    return (
                        <Popover position='tl' title='' content={item.name} key={item.name}>
                            <a href={"https://github.com/" + item.name}>
                                <Avatar shape='square'>
                                    <img src={item.img} alt={item.name} />
                                </Avatar>
                            </a>
                        </Popover>
                    )
                })}
            </Space>
        </div>
    )
}

export default Contributors;