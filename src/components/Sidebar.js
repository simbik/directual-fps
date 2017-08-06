import React, { PropTypes } from 'react';
import { Modal } from 'react-bootstrap';

const Sidebar = props => (
  <Modal
    className="Sidebar left"
    show={props.isVisible}
    onHide={props.onHide}
    autoFocus keyboard
  >
    <Modal.Header closeButton>
      <Modal.Title>Навигация</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      { props.children }
    </Modal.Body>
  </Modal>
  );

Sidebar.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  children: PropTypes.array.isRequired,
};

export default Sidebar;
