import PageLayout from "@/components/general/PageLayout";
import {Text, View} from 'react-native';
import SelectButton from "@/components/buttons/SelectButton";
import React from 'react';
import * as zod from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller } from "react-hook-form";
import BlueButton from "@/components/buttons/BlueButton";

const options = [
{'Everyone' : 'Anyone can comment on my posts.'},
{'Followers Only': 'Only users who follow me can comment on my posts.'},
{'Mutual Followers Only': 'Only users who follow me and I follow back can comment on my posts.'},
{'Following Only': 'Only users I follow can comment on my posts.'},
{'Followers and Following Only': "Only users who follow me or whom I follow can comment on my posts."}
]

const formSchema = zod.object({
  permission_status: zod.number().int().min(0).max(3).nullish()
});

type FormData = zod.infer<typeof formSchema>;

export default function CommentPersmissions(){

const { handleSubmit, control, watch, setError, formState: { isSubmitting, errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      permission_status: 0 
    }
  });



    return(
        <PageLayout
        headerTitle="Comment Permissions"
        >
            <Text style={{color: "#a6a6a6", fontSize: 11}}>Control who can comment on your posts by selecting one of the options below.</Text>
            <Controller
              control={control}
              name="permission_status"
              render={({ field: { onChange, value } }) => (
                <View style={{ gap: 16, marginTop: 32 }}>
                  {options.map((option, index) => {
                    const [key, subTitle] = Object.entries(option)[0];
                    return (
                      <SelectButton
                        title={key}
                        subTitle={subTitle}
                        key={key}
                        selected={value === index}
                        setSelected={onChange}
                        index={index}
                      />
                    );
                  })}
                </View>
              )}
            />
            <BlueButton
                title='Update Permission'
                style={{marginTop: 48}}
            />
        </PageLayout>
    )
}