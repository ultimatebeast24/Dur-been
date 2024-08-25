import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Layout, Menu, Dropdown, Button } from 'antd';
import { DownOutlined, HomeOutlined, AppstoreAddOutlined, LineChartOutlined, UserOutlined, MailOutlined } from '@ant-design/icons';
import MapComponent from './MapComponent.jsx';
import ArduinoSimulation from './ArduinoSimulation.jsx';
import DisplayBin from './DisplayBin.jsx';
import UserMap from './UserMap.jsx';
import AboutUs from './AboutUs.jsx'; // Import the new component
import ContactUs from './ContactUs.jsx'; // Import the new component

const { Header, Content } = Layout;

function App() {
  const menu = (
    <Menu>
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
  );

  return (
    <Router>
      <Layout className="min-h-screen">
        <Header className="bg-blue-600 flex items-center px-4">
          <div className="flex-none">
            <Dropdown overlay={menu} trigger={['click']}>
              <Button className="bg-white text-blue-600">
                Menu <DownOutlined />
              </Button>
            </Dropdown>
          </div>
          <div className="flex-grow flex justify-center">
            <Link to="/about-us">
              <Button className="bg-white text-blue-600 border-none">
                About Us
              </Button>
            </Link>
          </div>
          <div className="flex-none ml-4">
            <Link to="/contact-us">
              <Button className="bg-white text-blue-600">
                Contact Us <MailOutlined />
              </Button>
            </Link>
          </div>
        </Header>
        <Layout>
          <Content className="flex-1 p-4">
            <Routes>
              <Route path="/map" element={<MapComponent />} />
              <Route path="/arduino" element={<ArduinoSimulation />} />
              <Route path="/display-bin" element={<DisplayBin />} />
              <Route path="/user-map" element={<UserMap />} />
              <Route path="/about-us" element={<AboutUs />} /> {/* Add the new route */}
              <Route path="/contact-us" element={<ContactUs />} /> {/* Add the new route */}
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
}

export default App;
