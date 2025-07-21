import React from "react";
import { Card, Button, Row, Col } from "@themesberg/react-bootstrap";
import { useToast } from "../../shared/context/toast-context";

export const ToastExample = () => {
  const { success, error, warning, info } = useToast();

  const handleSuccessToast = () => {
    success("This is a success message!");
  };

  const handleErrorToast = () => {
    error("This is an error message!");
  };

  const handleWarningToast = () => {
    warning("This is a warning message!");
  };

  const handleInfoToast = () => {
    info("This is an info message!");
  };

  return (
    <Card border="light" className="bg-white shadow-sm mb-4">
      <Card.Body>
        <h5 className="mb-4">Toast Examples</h5>
        <p className="mb-4">
          Click the buttons below to see different types of toasts:
        </p>

        <Row>
          <Col md={3} className="mb-3">
            <Button
              variant="success"
              onClick={handleSuccessToast}
              className="w-100"
            >
              Success Toast
            </Button>
          </Col>
          <Col md={3} className="mb-3">
            <Button
              variant="danger"
              onClick={handleErrorToast}
              className="w-100"
            >
              Error Toast
            </Button>
          </Col>
          <Col md={3} className="mb-3">
            <Button
              variant="warning"
              onClick={handleWarningToast}
              className="w-100"
            >
              Warning Toast
            </Button>
          </Col>
          <Col md={3} className="mb-3">
            <Button variant="info" onClick={handleInfoToast} className="w-100">
              Info Toast
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};
