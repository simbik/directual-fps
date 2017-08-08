import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { Nav, Navbar, Glyphicon, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';
import directual from '../modules/directual';
import Sidebar from './Sidebar';
import directualLogo from '../styles/img/directual-logo.png';

class PageNavbar extends Component {
  static propTypes = {
    logout: PropTypes.func.isRequired,
    header: PropTypes.string,
  };

  static defaultProps = {
    header: 'Header',
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      isVisible: false,
      selected: 0,
      structures: [],
    };
  }

  updateSidebar(isVisible) {
    this.state.isVisible = isVisible;
    if (isVisible) {
      directual.api.structure('meta').list().then((response) => {
        const { list: structures } = response.result;
        this.setState({ structures });
        this.forceUpdate();
      });
    } else {
      this.forceUpdate();
    }
  }

  render() {
    return (
      <Navbar className="PageNavbar">
        <Helmet title={this.props.header} />
        <Nav className="hideNav" bsStyle="pills">
          <NavItem eventKey={1} onClick={() => this.updateSidebar(true)}>
            <Glyphicon glyph="menu-hamburger" />
          </NavItem>
          <NavItem to="/">{this.props.header}</NavItem>
          <NavItem onClick={this.props.logout} className="visible-xs"><Glyphicon glyph="log-out" className="logOut" /></NavItem>
          <Sidebar side="left" isVisible={this.state.isVisible} onHide={() => this.updateSidebar(false)}>
            {this.state.structures.map(struct => (
              <div key={struct.sid} className="struct">
                <h3><Link to={`/view/${struct.obj.link_view}/${struct.obj.name}`} onClick={() => this.updateSidebar(false)}>{struct.obj.name}</Link></h3>
                <Nav className="SidebarNav" bsStyle="pills" stacked activeKey={1} onSelect={() => this.updateSidebar(false)}>
                  {JSON.parse(struct.obj.input).map(v => <LinkContainer key={Object.values(v)[0]} to={`/input/${Object.values(v)[0]}/${Object.keys(v)[0]}`}><NavItem>{Object.keys(v)[0]}</NavItem></LinkContainer>)}
                </Nav>
              </div>
              ),
              )}
          </Sidebar>

        </Nav>

        <Nav pullRight className="hidden-xs">
          <NavItem><img src={directualLogo} alt="Directual" className="directualLogo" /></NavItem>
          <NavItem onClick={this.props.logout}><Glyphicon glyph="log-out" className="logOut" /></NavItem>
        </Nav>
      </Navbar>
    );
  }
}

export default PageNavbar;
