import React, { useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import {
  Col,
  Row,
  Card,
  Form,
  Button,
  Alert,
} from "@themesberg/react-bootstrap";
import axiosInstance from "../../axios";
import "./CreateDoctorTeamForm.scss";

export const CreateDoctorTeamForm = () => {
  const editorRef = useRef(null);

  const { id } = useParams();
  const history = useHistory();

  const [validated, setValidated] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [isSectoralResearchCategoryValid, setIsSectoralResearchCategoryValid] =
    useState(true);
  const [isTitleEditorValid, setIsTitleEditorValid] = useState(true);
  const [isObjectiveEditorValid, setIsObjectiveEditorValid] = useState(true);
  const [isResearchMethologyValid, setIsResearchMethologyValid] =
    useState(true);

  const [formData, setFormData] = useState({
    sectoralResearchCategory: "",
    studyTitle: "",
    studyObjective: "",
    researchMethology: "",
  });

  function getCapabilityById(memberId) {
    axiosInstance
      .get(`api/sectoral-and-research/${memberId}`)
      .then((response) => {
        console.log("response", response);
        setFormData({ ...response.data.sectoralResearch });
        console.log("formData", formData);
      })
      .catch((err) => {
        console.log("Error!");
      });
  }

  function createSectoralResearch() {
    try {
      axiosInstance
        .post("api/sectoral-and-research", formData)
        .then((response) => {
          history.push("/capability/all-sectoral-research");
        })
        .catch((err) => {
          console.log("Error!");
          setFormError(err.response.data.message);
        });
    } catch (error) {
      console.log("Something went wrong!");
    }
  }

  function updateSectoralResearch(memberId) {
    try {
      axiosInstance
        .patch(`api/sectoral-and-research/${memberId}`, formData)
        .then((response) => {
          setFormSuccess("Sectoral and Research has been updated!");
        })
        .catch((err) => {
          console.log("Error!");
          setFormError(err.response.data.message);
        });
    } catch (error) {
      setFormError("Something went wrong!");
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (id) {
      updateSectoralResearch(id);
    } else {
      createSectoralResearch();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleEditorChange = (content, editor, name) => {
    setFormData({
      ...formData,
      [name]: content,
    });
  };

  useEffect(() => {
    if (id) {
      getCapabilityById(id);
    }
  }, []);

  return (
    <Card border="light" className="bg-white shadow-sm mb-4">
      <Card.Body>
        <h5 className="mb-4">Add new Sectoral and Research</h5>

        {formError && <Alert variant="danger">{formError}</Alert>}

        {formSuccess && <Alert variant="success">{formSuccess}</Alert>}

        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Row>
            <Form.Group id="sectoralResearchCategory" className="mb-3">
              <Form.Label>Sectoral and Reserach Category</Form.Label>
              <Form.Select
                required
                name="sectoralResearchCategory"
                value={formData.sectoralResearchCategory}
                onChange={handleChange}
              >
                <option defaultValue>
                  Select sectoral and research category
                </option>
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
              <Form.Group id="studyTitle">
                <Form.Label>Study Title</Form.Label>
                <div className={!isTitleEditorValid && "invalid-editor"}>
                  <Editor
                    value={formData.studyTitle}
                    apiKey="q6tut9ishckw8kfsto8fek4zkak8ttiiu06x5wgev1rl0uzl"
                    onInit={(evt, editor) => (editorRef.current = editor)}
                    init={{
                      height: 300,
                      menubar: false,
                      plugins: [
                        "advlist autolink lists link image charmap print preview anchor",
                        "searchreplace visualblocks code fullscreen",
                        "insertdatetime media table paste code help wordcount",
                      ],
                      toolbar:
                        "undo redo | formatselect | " +
                        "bold italic backcolor | alignleft aligncenter " +
                        "alignright alignjustify | bullist numlist outdent indent | " +
                        "removeformat | help",
                      content_style:
                        "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                    }}
                    onEditorChange={(content, editor) =>
                      handleEditorChange(content, editor, "studyTitle")
                    }
                  />
                </div>
              </Form.Group>
            </Col>
          </Row>

          {/* Study Objective */}
          <Row>
            <Col className="mb-3">
              <Form.Group id="studyObjective">
                <Form.Label>Study Objective</Form.Label>
                <div className={!isObjectiveEditorValid && "invalid-editor"}>
                  <Editor
                    value={formData.studyObjective}
                    apiKey="q6tut9ishckw8kfsto8fek4zkak8ttiiu06x5wgev1rl0uzl"
                    onInit={(evt, editor) => (editorRef.current = editor)}
                    init={{
                      height: 300,
                      menubar: false,
                      plugins: [
                        "advlist autolink lists link image charmap print preview anchor",
                        "searchreplace visualblocks code fullscreen",
                        "insertdatetime media table paste code help wordcount",
                      ],
                      toolbar:
                        "undo redo | formatselect | " +
                        "bold italic backcolor | alignleft aligncenter " +
                        "alignright alignjustify | bullist numlist outdent indent | " +
                        "removeformat | help",
                      content_style:
                        "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                    }}
                    onEditorChange={(content, editor) =>
                      handleEditorChange(content, editor, "studyObjective")
                    }
                  />
                </div>
              </Form.Group>
            </Col>
          </Row>

          {/* Research Methodology */}
          <Row>
            <Col className="mb-3">
              <Form.Group id="researchMethology">
                <Form.Label>Research Methodology</Form.Label>
                <div className={!isResearchMethologyValid && "invalid-editor"}>
                  <Editor
                    value={formData.researchMethology}
                    apiKey="q6tut9ishckw8kfsto8fek4zkak8ttiiu06x5wgev1rl0uzl"
                    onInit={(evt, editor) => (editorRef.current = editor)}
                    init={{
                      height: 300,
                      menubar: false,
                      plugins: [
                        "advlist autolink lists link image charmap print preview anchor",
                        "searchreplace visualblocks code fullscreen",
                        "insertdatetime media table paste code help wordcount",
                      ],
                      toolbar:
                        "undo redo | formatselect | " +
                        "bold italic backcolor | alignleft aligncenter " +
                        "alignright alignjustify | bullist numlist outdent indent | " +
                        "removeformat | help",
                      content_style:
                        "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                    }}
                    onEditorChange={(content, editor) =>
                      handleEditorChange(content, editor, "researchMethology")
                    }
                  />
                </div>
              </Form.Group>
            </Col>
          </Row>

          <div className="mt-3">
            <Button variant="primary" type="submit">
              Save All
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};
