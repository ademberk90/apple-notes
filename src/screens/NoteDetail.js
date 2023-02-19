import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React, { useState, useRef } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

const touchColor = '#FFD52E';
const textColor = '#F9F9F9';
const bgColor = '#1D1D1F';
const selectionColor = 'rgba(255, 213, 46, 0.2)';

const NoteDetail = ({navigation, route}) => {
  const {id, note} = route.params;
  const [content, setContent] = useState(note?.content ? note.content : '');
  const [title, setTitle] = useState(note?.title ? note.title : '');

  const contentRef = useRef(); 

  const handleSaveNote = async () => {
    try {
      let existNoteList = await AsyncStorage.getItem('@notes');
      let noteArray = [];

      const date = new Date();
      if (existNoteList) {
        noteArray = JSON.parse(existNoteList);
        if (note) {
          const noteIndex = noteArray.findIndex(item => item.id === note.id);
          noteArray[noteIndex].title = title;
          noteArray[noteIndex].content = content;
          noteArray[noteIndex].date = date;
        } else {
          noteArray.push({id, title, content, date});
        }
      } else {
        noteArray.push({id, title, content, date});
      }
      await AsyncStorage.setItem('@notes', JSON.stringify(noteArray));
      navigation.goBack();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.returnBox}
          onPress={() => navigation.goBack()}>
          <FontAwesome name="chevron-left" color={touchColor} size={30} />
          <Text style={styles.noteText}>Notlar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleSaveNote()}>
          <Text style={styles.noteText}>Bitti</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.editorContainer}>
        <View style={styles.titleAreaContainer}>
          <TextInput
            autoFocus={true}
            style={styles.titleTextArea}
            multiline={true}
            onChangeText={val => setTitle(val)}
            returnKeyType="next"
            cursorColor={touchColor}
            selectionColor={selectionColor}
            spellCheck={false}
            underlineColorAndroid="transparent"
            autoCorrect={false}
            value={title}
          />
        </View>
        <TouchableOpacity
          style={styles.textAreaContainer}
          activeOpacity={1}
          onPress={() => contentRef.current.focus()}>
          <TextInput
            autoFocus={true}
            style={styles.contentTextArea}
            multiline={true}
            onChangeText={val => setContent(val)}
            cursorColor={touchColor}
            selectionColor={selectionColor}
            spellCheck={false}
            underlineColorAndroid="transparent"
            autoCorrect={false}
            ref={contentRef}
            value={content}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NoteDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: 'space-between',
  },
  returnBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  editorContainer: {
    flex: 1,
    padding: 0,
  },
  noteText: {
    color: touchColor,
    fontFamily: 'Poppins-Regular',
    marginLeft: 10,
    fontSize: 18,
  },
  titleAreaContainer: {
    paddingHorizontal: 10,
    backgroundColor: bgColor,
    marginHorizontal: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  titleTextArea: {
    fontSize: 36,
    color: textColor,
    fontFamily: 'Poppins-Bold',
  },
  textAreaContainer: {
    padding: 10,
    flex: 1,
    backgroundColor: bgColor,
    marginHorizontal: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  contentTextArea: {
    fontSize: 24,
    color: textColor,
    fontFamily: 'Poppins-Regular',
    marginBottom: 10,
  },
});
