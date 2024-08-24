import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { HomeOutlined, AppstoreAddOutlined, LineChartOutlined, UserOutlined } from '@ant-design/icons';
import MapComponent from './MapComponent.jsx';
import ArduinoSimulation from './ArduinoSimulation.jsx';
import DisplayBin from './DisplayBin.jsx';
import UserMap from './UserMap.jsx';

const { Header, Content } = Layout;

function App() {
  return (
    <Router>
      <Layout className="min-h-screen">
        <Header className="bg-blue-600">
          <div className="logo" />
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
            <Menu.Item key="1" icon={<HomeOutlined />}>
              <Link to="/map">Map</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<AppstoreAddOutlined />}>
              <Link to="/arduino">Arduino Simulation</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<LineChartOutlined />}>
              <Link to="/display-bin">Display Bin</Link>
            </Menu.Item>
            <Menu.Item key="4" icon={<UserOutlined />}>
              <Link to="/user-map">User Map</Link>
            </Menu.Item>
          </Menu>
        </Header>
        <Layout>
          <Content className="p-4">
            <Routes>
              <Route path="/map" element={<MapComponent />} />
              <Route path="/arduino" element={<ArduinoSimulation />} />
              <Route path="/display-bin" element={<DisplayBin />} />
              <Route path="/user-map" element={<UserMap />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
}

export default App;
