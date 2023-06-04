import React, { useState, useEffect, useRef } from 'react';
import { KeyboardAvoidingView, StyleSheet, View, Text, TouchableOpacity, Platform, TextInput, ScrollView, Button } from 'react-native';

//항목 보이는 컴포넌트
import Todo from './Todo';
import { FIRESTORE_DB } from '../firebaseConfig';
import { addDoc, collection, doc, onSnapshot, updateDoc, deleteDoc, query, orderBy, setDoc, getDoc } from 'firebase/firestore';
import firebase from 'firebase/app';
import 'firebase/firestore';

import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { FIREBASE_AUTH } from '../firebaseConfig';

export default function TodoList({ navigation, route }) {
    const [todo, setTodo] = useState(); //추가될 할일
    const [todolist, setTodolist] = useState([]);   //할일 목록
    const id = route.params.id; //유저 아이디

    const [date, setDate] = useState(new Date());   //날짜
    const [show, setShow] = useState(false);    //날짜 선택모달 보여줄지 말지
    const [selectedDate, setSelectedDate] = useState(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate());  //선택된 날짜
    const scrollViewRef = useRef(null);
    const [selectedValue, setSelectedValue] = useState('all');//할일 목록 필터링

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: "TodoList",
            headerStyle: {
                elevation: 10, // 안드로이드 그림자 효과
                shadowColor: 'black', // 그림자 색상 설정
                shadowOffset: { width: 0, height: 2 }, // 그림자 오프셋 설정
                shadowRadius: 4, // 그림자 반경 설정
            },
            headerRight: () => {
                return (
                    <>
                        <Button onPress={() => navigation.navigate('Login')} title="로그아웃" />
                    </>
                );
            },
        });
    }, [])

    const logout = () => {
        FIREBASE_AUTH.signOut()
        navigation.navigate('Login');
    }


    // 날짜에 맞는 할일 목록 가져오기
    useEffect(() => {
        // 유저 아이디에 해당하는 컬렉션에서 날짜에 맞는 문서 가져오기
        const todoRef = doc(collection(FIRESTORE_DB, `${id}`), selectedDate);
        // 해당 문서의 필드 가져오기
        const subscriber = onSnapshot(todoRef, {
            next: (snapshot) => {
                // 필드값이 존재하는 경우
                if (snapshot.data() !== undefined) {
                    // 필드값 가져오기
                    const todos = snapshot.data().data;
                    // todolist에 할일 목록 넣기
                    setTodolist(todos);
                } else {  // 필드값이 존재하지 않는 경우
                    setTodolist([]);    // todolist에 빈배열 저장
                }
            }
        });
        return () => subscriber();
    }, [selectedDate]);

    // 날짜 선택으로 날짜가 바뀔때 실행되는 함수
    const onChange = (event, selectDate) => {
        // 선택된 날짜가 있으면 선택된 날짜로, 없으면 현재 날짜로
        const currentDate = selectDate || date;
        //날짜를 선택된 날짜로 변경
        setDate(currentDate);
        // 날짜 선택 모달 종료
        setShow(false);
        let tempDate = new Date(currentDate);
        // 선택된 날짜를 2021-01-01 형식으로 변경
        let fDate = tempDate.getFullYear() + '-' + (tempDate.getMonth() + 1) + '-' + tempDate.getDate();
        // 바뀐 형식의 날짜로 저장
        setSelectedDate(fDate);
    }

    // 할일 추가 함수
    const handleAddTask = () => {
        // 할일을 입력했을 경우에만 실행
        if (todo !== "" && todo !== undefined) {
            const timestamp = new Date().getTime()
            setTodolist([...todolist, { title: todo, done: false, time: timestamp }]);
            data = [...todolist, { title: todo, done: false, time: timestamp }];
            setDoc(doc(FIRESTORE_DB, id, selectedDate), { data: data });
            setTodo('');
        }

        console.log("this is doc!!", doc);
    }

    // 할일 완료 함수
    const completeTask = (item, index) => {
        const toggleDone = async () => {
            // 할일 완료 여부 반전
            todolist[index].done = !todolist[index].done;
            // 바뀐 todolist로 다시 저장
            setDoc(doc(FIRESTORE_DB, id, selectedDate), { data: todolist });
        }
        toggleDone();
    }

    // 할일 삭제 함수
    const deleteTask = (item, index) => {
        // todolist에서 해당 할일 삭제
        todolist.splice(index, 1);
        const deleteItem = async () => {
            // 바뀐 todolist로 다시 저장
            setDoc(doc(FIRESTORE_DB, id, selectedDate), { data: todolist });
        }
        deleteItem();
    }


    return (

        <View style={styles.container}>

            {/* 날짜 선택 모달 */}
            {show &&
                <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode={'date'}
                    display="default"
                    onChange={onChange}
                />
            }

            {/* 오늘 할일 */}
            <View style={styles.tasksWrapper}>
                <View style={{ flexDirection: 'row', }}>
                    <TouchableOpacity onPress={() => setShow(true)}>
                        <Text style={styles.sectionTitle}>{selectedDate} 할일</Text>
                    </TouchableOpacity>
                    <View style={{ marginLeft: 50, justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                        <Picker
                            style={{ height: 50, width: 150, backgroundColor: 'white', borderWidth: 1, borderColor: 'black' }}
                            selectedValue={selectedValue}
                            onValueChange={(itemValue) => setSelectedValue(itemValue)}
                        >
                            <Picker.Item label="전체보기" value="all" />
                            <Picker.Item label="완료 전" value="false" />
                            <Picker.Item label="완료 후" value="true" />
                        </Picker>
                    </View>
                </View>
                <View style={{ height: 30 }} />
                <ScrollView
                    style={{ height: '65%' }}
                    contentContainerStyle={{ flexGrow: 1 }}
                    ref={scrollViewRef}
                    onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}>
                    <View style={styles.items}>
                        {/* 할일 목록*/}{
                            todolist.map((item, index) => {
                                if (selectedValue === 'all') {
                                    return (
                                        <Todo
                                            key={index}
                                            text={item.title}
                                            completed={item.done}
                                            onToggle={() => completeTask(item, index)}
                                            onDelete={() => deleteTask(item, index)}
                                        />
                                    );
                                } else if (selectedValue === 'true') {
                                    if (item.done === true) {
                                        return (
                                            <Todo
                                                key={index}
                                                text={item.title}
                                                completed={item.done}
                                                onToggle={() => completeTask(item, index)}
                                                onDelete={() => deleteTask(item, index)}
                                            />
                                        );
                                    }
                                } else if (selectedValue === 'false') {
                                    if (item.done === false) {
                                        return (
                                            <Todo
                                                key={index}
                                                text={item.title}
                                                completed={item.done}
                                                onToggle={() => completeTask(item, index)}
                                                onDelete={() => deleteTask(item, index)}
                                            />
                                        );
                                    }
                                }
                            })
                        }
                    </View>
                </ScrollView>
            </View>

            {/* 입력창 */}
            <View style={styles.writeTaskWrapper}>
                <TextInput style={styles.input} placeholder={'할일을 입력하세요!'} value={todo} onChangeText={text => setTodo(text)} />
                <TouchableOpacity onPress={() => handleAddTask()}>
                    <View style={styles.addWrapper}>
                        <Text style={styles.addText}>+</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E8EAED',
    },
    tasksWrapper: {
        paddingTop: 80,
        paddingHorizontal: 20,

    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    items: {
        marginTop: 30,
    },
    writeTaskWrapper: {
        position: 'absolute',
        bottom: 30,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 15,
        paddingLeft: 15

    },
    input: {
        paddingVertical: 15,
        paddingHorizontal: 15,
        backgroundColor: '#FFF',
        borderRadius: 10,
        bordercolor: '#c0c0c0',
        borderWidth: 1,
        width: 280,
        marginRight: 10,
        height: 50,
    },
    addWrapper: {
        width: 50,
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        bordercolor: '#c0c0c0',
        borderWidth: 1,
    },
    addText: {
        fontSize: 30,
        justifyContent: 'center',
        alignItems: 'center',
    }

});