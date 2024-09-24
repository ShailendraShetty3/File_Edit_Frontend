import React from 'react';
import { Layout, Typography, Button } from 'antd';
import './Homepage.css';
import { useNavigate } from 'react-router-dom';

const { Header, Content } = Layout;
const { Title } = Typography;

const HomePage = () => {

    const navigate = useNavigate();


    const handleFileClick = ()=>{
        navigate("/file")
    }

    const handleVideoClick = ()=>{
        navigate("/video")
    }

    return (
        <Layout style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
            <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <Button 
                        type="primary" 
                        size="large" 
                        style={{ margin: '10px', width: '200px' }} 
                        onClick={handleFileClick}
                    >
                        File Operation
                    </Button>
                    <Button 
                        type="default" 
                        size="large" 
                        style={{ margin: '10px', width: '200px' }} 
                        onClick={handleVideoClick}
                    >
                        Video Operation
                    </Button>
                </div>
            </Content>
        </Layout>
    );
};

export default HomePage;
