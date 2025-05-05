import Layout from "../../../profile/controlCentre/accountCenter/PageLayout";
import TextAreaInput from "../../../../components/form/TextAreaInput";
import {
  Keyboard,
  TouchableWithoutFeedback,
  Text,
  StyleSheet,
  View,
} from "react-native";
import BlueButton from "../../../../components/buttons/BlueButton";
import React from "react";
import ErrorMessage from "../../../../components/messsages/Error";
import { useUpdateResumeMutation } from "../../apiSlice";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../app/store";
import { setAbout } from "../../../../app/jobsSlice";
import { useRemoveFooter } from "../../../../helpers/hideFooter";

export default function About({ route }: { route: any }) {
  useRemoveFooter(route.params.addFooterOnUnmount);
  const currentAbout = useSelector((state: RootState) => state.jobs.about);
  const [text, setText] = React.useState(currentAbout || "");
  const [error, setError] = React.useState("");
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [updateResume, { isLoading }] = useUpdateResumeMutation();

  const handleUpdate = async () => {
    if (!text) {
      setError("Please enter some text");
      return;
    }

    try {
      await updateResume({ about: text }).unwrap();
      dispatch(setAbout(text));
      navigation.goBack();
    } catch (err) {
      console.log(err);
      setError("Failed to update resume");
    }
  };
  return (
    <Layout headerTitle="About">
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <>
          <Text style={styles.label}>Tell Us About You</Text>
          <TextAreaInput
            placeholder="Write here"
            text={text}
            setText={setText}
          />
          <View style={{ marginTop: 48, marginBottom: 8 }}>
            <BlueButton
              title="Save"
              onPress={handleUpdate}
              loading={isLoading}
              disabled={text === currentAbout || text === ""}
            />
          </View>
          <ErrorMessage message={error} />
        </>
      </TouchableWithoutFeedback>
    </Layout>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 11,
    marginBottom: 8,
    color: "#a6a6a6",
  },
});
