import React, { forwardRef } from "react";
import { Animated, FlatList, Pressable, View, Keyboard } from "react-native";
import SearchBar from "../../../profile/components/SearchBar";
import { SearchSuggestion } from "../workExperience/page";

type Props = {
	containerTranslateY: Animated.Value;
	searchFocused: boolean;
	setSearchFocused: React.Dispatch<React.SetStateAction<boolean>>;
	searchText: string;
	onChangeSearchText: React.Dispatch<React.SetStateAction<string>>;
	setResult: React.Dispatch<React.SetStateAction<any>>;
	suggestions: string[];
};

const SearchWithSuggestions = forwardRef<any, Props>(
	(
		{
			containerTranslateY,
			searchFocused,
			setSearchFocused,
			searchText,
			suggestions,
			onChangeSearchText,
			setResult
		},
		ref
	) => {
		const AnimatedView = Animated.createAnimatedComponent(View);

		return (
			<AnimatedView
				ref={ref}
				style={{ transform: [{ translateY: containerTranslateY }] }}
			>
				<SearchBar
					isFocused={searchFocused}
					setIsFocused={setSearchFocused}
					placeholder='ex: Central Board of Secondary Education (CBSE)'
					text={searchText}
					onChangeText={onChangeSearchText}
				/>

				{searchFocused && (
					<Pressable onPress={Keyboard.dismiss}
						style={{ height: "100%", backgroundColor: "#f7f7f7" }}>
						<FlatList
							data={searchText ? [searchText, ...suggestions] : suggestions}
							keyExtractor={(item) => item}
							keyboardShouldPersistTaps="handled"
							renderItem={({ item }) => (
								<SearchSuggestion
									title={item}
									onPress={() => {
										onChangeSearchText(item);
										setSearchFocused(false);
										Keyboard.dismiss();
										setResult(item);
									}}
								/>
							)}
						/>
					</Pressable>
				)}
			</AnimatedView>
		);
	}
);

export default React.memo(SearchWithSuggestions);
