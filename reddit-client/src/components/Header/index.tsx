import React from 'react'
import { Layout, Menu, Dropdown, Avatar, Button } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import Link from 'next/link';
import styles from "./Header.module.scss"
import { useRouter } from 'next/router';
import { useLogoutMutation, useMeQuery } from '../../generated/graphql';
import { isServer } from '../../utils/isServer';

interface headerProps {

}

const Header: React.FC<headerProps> = ({}) => {
    const { Header } = Layout;
    const router = useRouter()
    const [{ fetching: logoutFetching }, logout] = useLogoutMutation()
    const [{ data, fetching }] = useMeQuery({
        pause: isServer()
    })
    
    const logoutPageChange = () => {
        logout()
        router.push('/login')
    }
    const menu = (
        <Menu>
            <Menu.Item>
                Your Profile
            </Menu.Item>
            <Menu.Item>
                Your Settings
            </Menu.Item>
            <Menu.Item>
                <Button loading={logoutFetching} type="primary" size="small" danger onClick={() => logoutPageChange()}>Logout</Button>
            </Menu.Item>
        </Menu>
    );

    return (
        <Header className={styles.header}>
            <Link href="/"><a><h1 className={styles.title}>Reddit Clone</h1></a></Link>
            <Menu theme="dark" mode="horizontal">
                {
                    !data?.me ?
                            <>
                                <Menu.Item key="1"><Link href="/login"><a>LogIn</a></Link></Menu.Item>
                                <Menu.Item key="2"><Link href="/register"><a>Register</a></Link></Menu.Item>    
                            </>
                        :   <Dropdown overlay={menu} placement="bottomCenter" arrow>  
                                <div className={styles.loggedIn}>
                                    <Avatar style={{ backgroundColor: "#1890ff", verticalAlign: 'middle' }} size="large">
                                        {data.me.username[0].toUpperCase()}
                                    </Avatar>
                                    {data.me.username}
                                    <CaretDownOutlined />
                                </div>
                            </Dropdown>
                }
            </Menu>
        </Header>
    );
}

export default Header