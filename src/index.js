import React from "react";
import { View, Button, ScrollView } from "react-native";
import {
  Container,
  Header,
  Content,
  Input,
  Item,
  Label,
  Form,
  Text,
  ActionSheet
} from "native-base";

import FormFields from "./formFields";

var BUTTONS = ["Camera", "Photo Libarary", "Document", "Cancel"];

var CAMERA_INDEX = 0;
var PHOTO_INDEX = 1;
var DOCUMENT_INDEX = 2;
var CANCEL_INDEX = 3;

export default class FormRuntime extends React.Component {
  formEl = null;
  props: {
    formDesign: {},
    type: string,
    data: {},
    validation: {}
  };
  constructor(props) {
    super(props);
    // this.setState({
    //   formValues: {},
    //   error: null,
    //   errorInfo: null,
    //   formErrors: {}
    // });
    this.form = React.createRef();
    // Avoid Controlled and UnControlled components waring
    this.state = {
      formValues: {}
    };

    this.handleChange = this.handleChange.bind(this);
    this.askForPermission = this.askForPermission.bind(this);
    this.uploadImageAsync = this.uploadImageAsync.bind(this);
  }
  getRefernce(el) {
    this.formEl = el;
  }

  handleSubmit(ACTION: string) {
    const { submit, type } = this.props;
    const { formValues } = this.state;
    // Think of a way to validate
    if (type === "vendor") {
      if (!this.validate()) submit(formValues, ACTION);
    } else if (!this.validate()) {
      console.log("FROM FORM: " + this.state);
      submit(formValues, ACTION);
    }
  }

  handleChange(field, value, customEvent = null) {
    this.setState({
      formValues: {
        ...this.state.formValues,
        [field]: value
      }
    });
  }

  handleError(field, value) {
    this.setState({
      formErrors: {
        ...this.state.formErrors,
        [field]: validate(field, value)
      }
    });
  }

  async uploadImageAsync(uri) {
    let apiUrl = "http://0d8f387e.ngrok.io/request/upload/1";

    // Note:
    // Uncomment this if you want to experiment with local server
    //
    // if (Constants.isDevice) {
    //   apiUrl = `https://your-ngrok-subdomain.ngrok.io/upload`;
    // } else {
    //   apiUrl = `http://localhost:3000/upload`
    // }

    let uriParts = uri.split(".");
    let fileType = uriParts[uriParts.length - 1];

    let formData = new FormData();
    formData.append("photo", {
      uri,
      name: `photo.${fileType}`,
      type: `image/${fileType}`
    });

    let options = {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data"
      }
    };

    return fetch(apiUrl, options);
  }
  async selectDocument(field) {
    const options = { copyToCacheDirectory: false };
    let result = await Expo.DocumentPicker.getDocumentAsync(options);
    console.log(result);
  }

  async askForPermission() {
    const { Permissions } = Expo;

    const results = await Promise.all([
      Permissions.askAsync(Permissions.CAMERA),
      Permissions.askAsync(Permissions.CAMERA_ROLL)
    ]);
    if (results.some(({ status }) => status !== "granted")) {
      alert("Please goto settings and enable us to use Camera and Gallery");
      return false;
    } else {
      return true;
    }
  }

  async selectPhoto(field) {
    //
    // const isGranted = await this.askForPermission();
    // if (isGranted) {
    console.log("Photo " + field);

    const options = { type: "Images" };
    let result = await Expo.ImagePicker.launchImageLibraryAsync(options);
    if (!result.cancelled) {
      let uri = result.uri;
      //   uploadResponse = await uploadImageAsync(result.uri);
      /////
      let apiUrl = "http://0d8f387e.ngrok.io/request/upload/1";

      // Note:
      // Uncomment this if you want to experiment with local server
      //
      // if (Constants.isDevice) {
      //   apiUrl = `https://your-ngrok-subdomain.ngrok.io/upload`;
      // } else {
      //   apiUrl = `http://localhost:3000/upload`
      // }

      let uriParts = uri.split(".");
      let fileType = uriParts[uriParts.length - 1];

      let formData = new FormData();
      formData.append("photo", {
        uri,
        name: `photo.${fileType}`,
        type: `image/${fileType}`
      });
      debugger;
      let options = {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data"
        }
      };

      return fetch(apiUrl, options);
      ////
    }
    console.log(result);
    // }
  }

  async selectCamera(field) {
    console.log("Camera " + field);
    const options = {
      allowsEditing: false,
      quality: 1,
      base64: true,
      exif: false
    };
    let result = await Expo.ImagePicker.launchCameraAsync(options);
    console.log(result);
  }
  componentDidMount() {
    const { data } = this.props;
    this.setState({
      formValues: data || {},
      error: null,
      errorInfo: null,
      formErrors: {}
    });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data && this.props.type === "view") {
      this.setState({
        formValues: nextProps.data || {},
        error: null,
        errorInfo: null,
        formErrors: {}
      });
    }
  }
  render() {
    const { formDesign, type } = this.props;
    return (
      <ScrollView scrollEnabled={false} keyboardShouldPersistTaps="handled">
        <Form>
          {formDesign.map((field, index) => {
            return (
              <FormFields
                $properties={field}
                key={"field" + index}
                onChangeText={value => this.handleChange(field.field, value)}
                onBlur={value => {
                  this.handleError(field.field, value);
                }}
                onEndEditing={value => {
                  this.handleError(field.field, value);
                }}
                error={
                  this.state.formErrors
                    ? this.state.formErrors[field.field]
                    : null
                }
                customHandleChange={this.handleChange}
                value={
                  this.state.formValues
                    ? this.state.formValues[field.field]
                    : ""
                }
                selectDocument={this.selectDocument}
                selectPhoto={this.selectPhoto}
                selectCamera={this.selectCamera}
                viewType={type}
              />
            );
          })}
          {type !== "view" &&
            type !== "vendor" && (
              <View>
                <Button
                  title="Choose another source"
                  onPress={() => this.handleSubmit("ANOTHER_SOURCE")}
                />
                <Button title="Pay" onPress={() => this.handleSubmit("PAY")} />
                <Button
                  title="Back to services types"
                  onPress={() => this.handleSubmit("MAIN_SERVICES")}
                />
              </View>
            )}

          {type === "vendor" && (
            <View>
              <Button
                full
                onPress={() => {
                  this.handleSubmit("BID");
                }}
                title="Bid"
              >
                <Text>Bid</Text>
              </Button>
            </View>
          )}
        </Form>
      </ScrollView>
    );
  }
}

// export const FormRuntime = FormContainer;
