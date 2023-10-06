
import React, { useState, useRef } from "react";
import { Editor } from '@tinymce/tinymce-react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Card, Form, Button, InputGroup } from '@themesberg/react-bootstrap';


export const CreateSectoralResearchForm = () => {
  const editorRef = useRef(null);

  return (
    <Card border="light" className="bg-white shadow-sm mb-4">
      <Card.Body>
        <h5 className="mb-4">Add new Sectoral and Research</h5>
        <Form>
          <Row>
          <Form.Group className="mb-3">
            <Form.Label>Sectoral and Reserach Category</Form.Label>
            <Form.Select>
              <option defaultValue>Select sectoral and research category</option>
              <option>Health and Nutrition</option>
              <option>Education</option>
              <option>Governance, Proverty and Gender Issues</option>
              <option>Trade and Industry</option>
            </Form.Select>
          </Form.Group>
          </Row>
          {/* Study Title */}
          <Row>
            <Col className="mb-3">
              <Form.Group id="description">
                <Form.Label>Study Title</Form.Label>
                {/* <Form.Control required as="textarea" rows="3" placeholder="Details description of the members bio"/> */}
                <Editor
                  onInit={(evt, editor) => editorRef.current = editor}
                  initialValue="<p>This is the initial content of the editor.</p>"
                  init={{
                    height: 300,
                    menubar: false,
                    plugins: [
                      'advlist autolink lists link image charmap print preview anchor',
                      'searchreplace visualblocks code fullscreen',
                      'insertdatetime media table paste code help wordcount'
                    ],
                    toolbar: 'undo redo | formatselect | ' +
                    'bold italic backcolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                  }}
                />
              </Form.Group>
            </Col>
          </Row>
          
          {/* Study Objective */}
          <Row>
            <Col className="mb-3">
              <Form.Group id="description">
                <Form.Label>Study Objective</Form.Label>
                {/* <Form.Control required as="textarea" rows="3" placeholder="Details description of the members bio"/> */}
                <Editor
                  onInit={(evt, editor) => editorRef.current = editor}
                  initialValue="<p>This is the initial content of the editor.</p>"
                  init={{
                    height: 300,
                    menubar: false,
                    plugins: [
                      'advlist autolink lists link image charmap print preview anchor',
                      'searchreplace visualblocks code fullscreen',
                      'insertdatetime media table paste code help wordcount'
                    ],
                    toolbar: 'undo redo | formatselect | ' +
                    'bold italic backcolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                  }}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Research Methodology */}
          <Row>
            <Col className="mb-3">
              <Form.Group id="description">
                <Form.Label>Research Methodology</Form.Label>
                {/* <Form.Control required as="textarea" rows="3" placeholder="Details description of the members bio"/> */}
                <Editor
                  onInit={(evt, editor) => editorRef.current = editor}
                  initialValue="<p>This is the initial content of the editor.</p>"
                  init={{
                    height: 300,
                    menubar: false,
                    plugins: [
                      'advlist autolink lists link image charmap print preview anchor',
                      'searchreplace visualblocks code fullscreen',
                      'insertdatetime media table paste code help wordcount'
                    ],
                    toolbar: 'undo redo | formatselect | ' +
                    'bold italic backcolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                  }}
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="mt-3">
            <Button variant="primary" type="submit">Save All</Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};
