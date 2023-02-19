import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/core';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NoteSummary from '../components/NoteSummary';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {SwipeListView} from 'react-native-swipe-list-view';

const touchColor = '#FFD52E';
const textColor = '#F9F9F9';
const bgColor = '#1D1D1F';
const dangerColor = '#B31931';

const HomeScreen = ({navigation, route}) => {
  const [noteList, setNoteList] = useState([]);
  const [noteListBackUp, setNoteListBackUp] = useState([]);
  const [lastId, setLastId] = useState(null);
  const [searchKey, setSearchKey] = useState("");

  const getData = async () => {
    try {
      const data = await AsyncStorage.getItem('@notes');
      if (data !== null) {
        var noteArray = JSON.parse(data);
        noteArray.sort((a, b) => new Date(b.date) - new Date(a.date));
        noteArray.map((note, index) => (note.key = index));
        setNoteList(noteArray);
        setNoteListBackUp(noteArray);
        setLastId(noteArray[noteArray.length - 1].id);
      } else {
        setLastId(-1);
      }
    } catch (e) {
      // error reading value
    }
  };

  const handlePressNoteSummary = id => {
    const note = noteList.find(item => item.id === id);
    navigation.navigate('NoteDetail', {note: note});
  };

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const removeNoteFromStore = async (rowMap, id) => {
    closeRow(rowMap, id);
    const newData = [...noteList];
    const indexOfNote = noteList.findIndex(note => note.id == id);
    newData.splice(indexOfNote, 1);

    await AsyncStorage.setItem('@notes', JSON.stringify(newData));

    setNoteList(newData);
  };

  const handleSearch = val => {
    setSearchKey(val);
    if (val != '') {
      const filteredList = noteListBackUp.filter(
        note =>
          note.title.toLowerCase().includes(val.toLowerCase()) ||
          note.content.toLowerCase().includes(val.toLowerCase()),
      );
      setNoteList(filteredList);
    } else {
      setNoteList(noteListBackUp);
    }
  };
  
  useFocusEffect(
    React.useCallback(() => {
      setSearchKey("");
      getData();
      //return () => unsubscribe();
    }, []),
  );

  return (
    <View style={styles.body}>
      <View style={styles.container}>
        <Text style={styles.header}>Notlar</Text>
        <View style={styles.searchSection}>
          <Icon name="search" size={14} color="#818183" />
          <TextInput
            style={styles.searchInput}
            placeholder="Arayın"
            placeholderTextColor="#818183"
            underlineColorAndroid="transparent"
            autoCorrect={false}
            onChangeText={val => handleSearch(val)}
            value={searchKey}
          />
        </View>
        <View style={styles.scrollViewContainer}>
          {noteList.length != 0 && (
            <SwipeListView
              data={noteList}
              style={styles.swipeList}
              disableRightSwipe={true}
              stopRightSwipe={-75}
              rightOpenValue={-75}
              closeOnRowOpen={true}
              renderItem={(data, rowMap) => (
                <TouchableHighlight
                  key={data.item.id}
                  onPress={() => handlePressNoteSummary(data.item.id)}
                  style={data.item.key != 0 ? styles.rowFront : [styles.rowFront, styles.rowFrontBorder]}>
                  <NoteSummary note={data.item} />
                </TouchableHighlight>
              )}
              renderHiddenItem={(data, rowMap) => (
                <View style={data.item.key != 0 ? styles.rowBack : [styles.rowBack, styles.rowBackBorder]}>
                  <TouchableOpacity
                    style={data.item.key != 0 ? styles.dangerBtn : [styles.dangerBtn, styles.dangerBtnBorder]}
                    onPress={() => removeNoteFromStore(rowMap, data.item.id)}>
                    <FontAwesome name="trash" color="#fff" size={30} />
                  </TouchableOpacity>
                </View>
              )}
            />
          )}
        </View>
      </View>

      <View style={styles.footerBar}>
        <View style={styles.emptyBox}></View>
        <Text style={styles.total}>{noteList?.length} Not</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('NoteDetail', {id: lastId + 1})}>
          <FontAwesome name="edit" color={touchColor} size={30} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  container: {
    fontFamily: 'Poppins-Regular',
    paddingHorizontal: 15,
    paddingTop: 10,
    flex: 1,
  },
  header: {
    fontSize: 30,
    fontFamily: 'Poppins-Bold',
    color: textColor,
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: bgColor,
    borderRadius: 10,
    paddingLeft: 10,
    marginTop: 10,
  },
  searchInput: {
    paddingLeft: 7,
    color: textColor,
    flex: 1,
  },
  scrollViewContainer: {
    marginBottom: 5,
    flex: 1,
    marginTop: 15,
    borderRadius: 10,
    backgroundColor: bgColor
  },
  swipeList:{
    borderRadius: 10,
  },
  rowFront: {
    justifyContent: 'center',
    borderBottomColor: 'white',
    borderBottomWidth: StyleSheet.hairlineWidth,
    backgroundColor: bgColor,
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  rowFrontBorder:{
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  rowBack: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: bgColor
  },
  rowBackBorder:{
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  dangerBtn: {
    backgroundColor: dangerColor,
    right: 0,
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  dangerBtnBorder:{
    borderTopRightRadius: 10
  },
  line: {
    height: 1,
    backgroundColor: '#818183',
    marginVertical: 7,
  },
  footerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  total: {
    color: textColor,
    fontFamily: 'Poppins-Regular',
  },
});

export default HomeScreen;
