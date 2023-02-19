import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

const touchColor = '#FFD52E';
const textColor = '#F9F9F9';
const bgColor = '#1D1D1F';
const selectionColor = 'rgba(255, 213, 46, 0.2)';

const NoteSummary = ({note}) => {
  // content
  let content = note.content;
  console.log(content);
  //console.log(content);
  if(content?.includes('\n')){
    content = content.split('\n')[0] + '...';
  }
  if(content && content.length > 20){
    content = content.slice(0,20) + '...';
  }
  // Date
  let date = note?.date ? new Date(note.date) : null;
  let dateStr;
  if(date){
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    if(diffDays > 7){
      let day = ("00" + date.getDate()).slice(-2);
      let month = ( "00" + (date.getMonth() + 1)).slice(-2);
      let year = date.getFullYear();

      dateStr = day + '.' + month + '.' + year;
    }
    else if(diffDays < 7 && diffDays > 1){
      dateStr = date.toLocaleDateString('tr-TR', { weekday: 'long' });
    }
    else{
      let hour = ("00" + date.getHours()).slice(-2);
      let minute = ("00" + date.getMinutes()).slice(-2);
      let second = ("00" + date.getSeconds()).slice(-2);

      dateStr = hour + ':' + minute;    
    }
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{note.title}</Text>
      <View style={styles.content}>
        <Text style={styles.date}>{dateStr}</Text>
        <Text style={styles.description}>{content}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card:{

  },
  title: {
    color: textColor,
    fontSize: 24,
    fontFamily: 'Poppins-Regular',
  },
  content: {
    flexDirection: 'row',
  },
  date: {
    color: textColor,
    fontFamily: 'Poppins-Regular',
  },
  description: {
    color: textColor,
    paddingLeft: 10,
    fontFamily: 'Poppins-Regular',
  },
  line: {
    height: 1,
    backgroundColor: '#818183',
    marginVertical: 7,
  },
});

export default NoteSummary;
