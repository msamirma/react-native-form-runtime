import React from "react";
import { View, TextInput, Text, Button } from "react-native";
import {
  Input,
  Item,
  Label,
  Icon,
  Picker,
  ListItem,
  CheckBox,
  Body,
  ActionSheet
} from "native-base";

const FormFields = props => {
  const {
    customHandleChange,
    value,
    selectDocument,
    selectCamera,
    selectPhoto,
    viewType
  } = props;
  const { type, label, labelAr, options, optionsAr, field } = props.$properties;

  if (viewType === "view") {
    return (
      <View>
        <Text>
          {label} : {value}
        </Text>
      </View>
    );
  }
  if (type == "Text") {
    return (
      <View>
        <Item floatingLabel>
          <Label>{label}</Label>
          <Input {...props} />
        </Item>
        props.error ? <Text>{props.error}</Text> : null
      </View>
    );
  } else if (type == "Number") {
    return (
      <View>
        <Item floatingLabel>
          <Label>{label}</Label>
          <Input {...props} keyboardType="numeric" maxLength={10} />
        </Item>
        props.error ? <Text>{props.error}</Text> : null
      </View>
    );
  } else if (type == "Picker") {
    return (
      <View>
        <Picker
          {...props}
          mode="dropdown"
          placeholder={label}
          iosIcon={<Icon name="ios-arrow-down-outline" />}
          style={{ width: undefined }}
          selectedValue={value}
          onValueChange={value => customHandleChange(field, value)}
        >
          {options.map(option => {
            return <Picker.Item label={option} value={option} key={option} />;
          })}
        </Picker>
        props.error ? <Text>{props.error}</Text> : null
      </View>
    );
  } else if (type == "Checkbox") {
    return (
      <ListItem>
        <CheckBox
          checked={value}
          onPress={() => {
            customHandleChange(field, !value);
          }}
        />
        <Body>
          <Text>{label}</Text>
        </Body>
      </ListItem>
    );
  } else if (type == "Document") {
    return (
      <View>
        <Button title={label} onPress={() => selectDocument(field)} />
      </View>
    );
  } else if (type == "Photo") {
    var BUTTONS = ["Camera", "Photo Libarary", "Document", "Cancel"];

    var CAMERA_INDEX = 0;
    var PHOTO_INDEX = 1;
    var DOCUMENT_INDEX = 2;
    var CANCEL_INDEX = 3;
    return (
      <Button
        onPress={async () =>
          ActionSheet.show(
            {
              options: BUTTONS,
              cancelButtonIndex: CANCEL_INDEX,
              title: label
            },
            async buttonIndex => {
              if (buttonIndex === DOCUMENT_INDEX) {
                await selectDocument(field);
              } else if (buttonIndex === CAMERA_INDEX) {
                let res = false;
                const { Permissions } = Expo;

                const results = await Promise.all([
                  Permissions.askAsync(Permissions.CAMERA),
                  Permissions.askAsync(Permissions.CAMERA_ROLL)
                ]);
                if (results.some(({ status }) => status !== "granted")) {
                  alert(
                    "Please goto settings and enable us to use Camera and Gallery"
                  );
                  res = false;
                } else {
                  res = true;
                }
                if (res) await selectCamera(field);
              } else if (buttonIndex === PHOTO_INDEX) {
                let res = false;
                const { Permissions } = Expo;

                const results = await Promise.all([
                  Permissions.askAsync(Permissions.CAMERA),
                  Permissions.askAsync(Permissions.CAMERA_ROLL)
                ]);
                if (results.some(({ status }) => status !== "granted")) {
                  alert(
                    "Please goto settings and enable us to use Camera and Gallery"
                  );
                  res = false;
                } else {
                  res = true;
                }
                if (res) await selectPhoto(field);
              }
            }
          )
        }
        title={label}
      />
    );
  } else if (type == "Label") {
    return (
      <View>
        <Text>
          {label} : {value}
        </Text>
      </View>
    );
  }
};

export default FormFields;
