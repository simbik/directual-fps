import React, { Component } from 'react';
import { Nav, Navbar, Glyphicon, NavItem } from 'react-bootstrap';
import directual from '../modules/directual';
import Sidebar from './Sidebar';

class PageNavbar extends Component {
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

  handleSelect(selectedKey) {
    this.state.selected = selectedKey;
    alert(`selected ${selectedKey}`);
  }

  render() {
    return (
      <Navbar className="PageNavbar">
        <Nav>
          <NavItem eventKey={1} onClick={() => this.updateSidebar(true)}>
            <Glyphicon glyph="menu-hamburger" />
          </NavItem>
          <Sidebar side="left" isVisible={this.state.isVisible} onHide={() => this.updateSidebar(false)}>
            {this.state.structures.map(struct => (
              <div key={struct.sid} className="struct">
                <h3><a href="/" data-view={struct.obj.link_view}>{struct.obj.name}</a></h3>
                <Nav className="SidebarNav" bsStyle="pills" stacked activeKey={1} onSelect={this.handleSelect}>
                  <NavItem href="#">Item 2</NavItem>
                  <NavItem href="#">Item 3</NavItem>
                  <NavItem href="#">Item 4</NavItem>
                  <NavItem href="#">Item 5</NavItem>
                </Nav>
              </div>
              ),
              )}
          </Sidebar>
        </Nav>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="/">Directual Universal Front</a>
          </Navbar.Brand>
        </Navbar.Header>
      </Navbar>
    );
  }
}

export default PageNavbar;
