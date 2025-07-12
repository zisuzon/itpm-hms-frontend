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
  Image,
} from "@themesberg/react-bootstrap";
import axiosInstance from "../../axios";
import PlaceholderPP from "../../assets/img/pp-placeholder.jpeg";
import { BE_IMAGE_PATH } from "../../utils/constants";

export const CreatePatientForm = () => {
  const { id } = useParams();
  const history = useHistory();

  const editorRef = useRef(null);
  const [validated, setValidated] = useState(false);
  const [isDescriptionValid, setIsDescriptionValid] = useState(true);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    shortDescription: "",
    description: "",
    sortId: "",
    image: "",
    address: "",
    email: "",
    phone: "",
    designation: "",
  });
  // Image upload
  const filePickerRef = useRef();
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const maximumSize = 2 * 1024 * 1024; // 2MB

  function getPatientById(patientId) {
    axiosInstance
      .get(`api/patients/${patientId}`)
      .then((response) => {
        console.log("response", response);
        setFormData({ ...response.data.patient });
        console.log("formData", formData);
      })
      .catch((err) => {
        console.log("Error!");
      });
  }

  function createPatient() {
    if (!formData.image) {
      setFormError("Patient image missing!");
      return;
    }

    const payloadFormData = new FormData();
    payloadFormData.append("name", formData.name);
    payloadFormData.append("shortDescription", formData.shortDescription);
    payloadFormData.append("description", formData.description);
    payloadFormData.append("sortId", formData.sortId);
    payloadFormData.append("image", formData.image);
    payloadFormData.append("email", formData.email);
    payloadFormData.append("phone", formData.phone);
    payloadFormData.append("designation", formData.designation);

    try {
      axiosInstance
        .post("api/patients", payloadFormData, {
          headers: {
            Accept: "*/*",
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          history.push("/patients/all-patients");
        })
        .catch((err) => {
          console.log("Error!");
          setFormError(err.response.data.message);
        });
    } catch (error) {
      console.log("Something went wrong!");
    }
  }

  function updatePatient(patientId) {
    if (!formData.image) {
      setFormError("Patient image missing!");
      return;
    }

    const payloadFormData = new FormData();
    payloadFormData.append("name", formData.name);
    payloadFormData.append("shortDescription", formData.shortDescription);
    payloadFormData.append("description", formData.description);
    payloadFormData.append("sortId", formData.sortId);
    payloadFormData.append("image", formData.image);
    payloadFormData.append("email", formData.email);
    payloadFormData.append("phone", formData.phone);
    payloadFormData.append("designation", formData.designation);

    try {
      axiosInstance
        .patch(`api/patients/${patientId}`, payloadFormData, {
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          setFormSuccess("Patient has been updated!");
        })
        .catch((err) => {
          console.log("Error!");
          setFormError(err.response.data.message);
        });
    } catch (error) {
      setFormError("Something went wrong!");
    }
  }

  useEffect(() => {
    if (id) {
      getPatientById(id);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEditorChange = (content, editor, name) => {
    setFormData({
      ...formData,
      [name]: content,
    });
  };

  const handleSubmit = (event) => {
    setIsDescriptionValid(true);
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
    if (!formData.description) {
      setIsDescriptionValid(false);
    }

    if (id) {
      updatePatient(id);
    } else {
      createPatient();
    }
  };

  // Image upload
  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      console.log(fileReader.result);
      setPreviewUrl(fileReader.result);
    };

    fileReader.readAsDataURL(file);
  }, [file]);

  const pickedHandler = (event) => {
    if (!event.target.files || event.target.files.length > 1) {
      setFormError("Something went wrong with your upload!");
      return;
    }

    const pickedFile = event.target.files[0];

    if (pickedFile.size >= maximumSize) {
      setFormError("Image size must not exceed 2MB!");
      return;
    }

    setFile(pickedFile);
    setFormData({
      ...formData,
      image: pickedFile,
    });
  };

  function getImage() {
    if (previewUrl) {
      return previewUrl;
    }

    if (formData?.image) {
      return `${BE_IMAGE_PATH}/${formData?.image}`;
    }

    return PlaceholderPP;
  }

  return (
    <Card border="light" className="bg-white shadow-sm mb-4">
      <Card.Body>
        <h5 className="mb-4">Add new Patient</h5>

        {formError && <Alert variant="danger">{formError}</Alert>}

        {formSuccess && <Alert variant="success">{formSuccess}</Alert>}

        <Row>
          <Col md={4} className="mb-3">
            <Card style={{ width: "12rem", height: "12rem" }}>
              <Card.Img
                style={{ width: "12rem", height: "12rem" }}
                variant="top"
                src={getImage()}
              />
            </Card>
          </Col>
          <Col md={6} className="mt-3">
            <Button variant="outline-primary" onClick={pickImageHandler}>
              Pick Photo
            </Button>
          </Col>
        </Row>

        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Row>
            {/* Image upload input form */}
            <input
              id="image"
              ref={filePickerRef}
              style={{ display: "none" }}
              type="file"
              accept=".jpg,.png,.jpeg"
              onChange={pickedHandler}
            />

            {/* Name */}
            <Col md={6} className="mb-3">
              <Form.Group id="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            {/* Sort ID */}
            <Col md={6} className="mb-3">
              <Form.Group id="sortId">
                <Form.Label>Position</Form.Label>
                <Form.Control
                  required
                  type="number"
                  placeholder="Position number of the member in list"
                  name="sortId"
                  value={formData.sortId}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="align-items-center">
            {/* Designation */}
            <Col md={6} className="mb-3">
              <Form.Group id="designation">
                <Form.Label>Designation</Form.Label>
                <Form.Control
                  required
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            {/* Email */}
            <Col md={6} className="mb-3">
              <Form.Group id="emal">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row></Row>

          <Row className="align-items-center">
            {/* Phone */}
            <Col md={6} className="mb-3">
              <Form.Group id="phone">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Address */}
          <Row>
            <Col sm={9} className="mb-3">
              <Form.Group id="shortDescription">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Short Description */}
          <Row>
            <Col sm={9} className="mb-3">
              <Form.Group id="shortDescription">
                <Form.Label>Short Description</Form.Label>
                <Form.Control
                  type="text"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Description */}
          <Row>
            <Col sm={9} className="mb-3">
              <Form.Group id="description">
                <Form.Label>Description</Form.Label>
                <div className={!isDescriptionValid ? "invalid-editor" : ""}>
                  <Editor
                    value={formData.description}
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
                      handleEditorChange(content, editor, "description")
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
