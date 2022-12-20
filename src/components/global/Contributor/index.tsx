import React from 'react';
import { Avatar, Space } from '@arco-design/web-react';
import { Popover } from '@arco-design/web-react';
import contributors from './data'
import "@arco-design/web-react/dist/css/arco.css";
const AvatarGroup = Avatar.Group;

function Contributors(props): JSX.Element {
    let data = contributors.portal
    if (props.type === 'go-zero') {
        data = contributors.goZero
    }

    return (
        <div>
            {
                <Space wrap size={[10, 10]}>
                    {data.map((item, index) => {
                        return (
                            <Popover position='tl' title='' content={item.login} key={item.login}>
                                <a href={"https://github.com/" + item.login} target="_blank">
                                    <Avatar shape='square'>
                                        <img src={item.avatar_url} alt={item.login} />
                                    </Avatar>
                                </a>
                            </Popover>
                        )
                    })}
                </Space>
            }

        </div>
    )
}

export default Contributors;