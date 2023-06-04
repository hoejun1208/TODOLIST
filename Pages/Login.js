import { View, Text, Button, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { FIREBASE_AUTH } from '../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const Login = ({ navigation, route }) => {
    const [email, setEmail] = useState(''); // 이메일
    const [password, setPassword] = useState('');   // 비밀번호
    const [isSignUp, setIsSignUp] = useState(false);    // 회원가입 여부
    const auth = FIREBASE_AUTH; // 파이어베이스 인증 객체

    // 회원가입 함수
    const signUp = async () => {
        // 이메일과 비밀번호로 회원가입
        const after = await createUserWithEmailAndPassword(auth, email, password);
        setIsSignUp(false);
        console.log("after", after);
    }

    // 로그인 함수
    const signIn = async () => {
        // 이메일과 비밀번호로 로그인
        const user = await signInWithEmailAndPassword(auth, email, password);
        // 로그인 성공시 이메일 저장
        const id = user._tokenResponse.email;
        // 이메일을 포함하여 Todo 페이지로 이동
        navigation.navigate('TodoList', { id })
    }


    return (
        <View style={styles.container}>
            {isSignUp ?
                (<>
                    <Text style={styles.text}>회원가입 페이지</Text>
                    <TextInput stlye={styles.input} placeholder="이메일" onChangeText={(text) => setEmail(text)} value={email} />
                    <View style={{ height: 20 }} />
                    <TextInput secureTextEntry={true} placeholder="비밀번호(6자 이상)" textContentType='password' onChangeText={(text) => setPassword(text)} value={password} />
                    <View style={{ height: 20 }} />
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ width: 150, height: 50 }}>
                            <Button title="회원가입" onPress={signUp} />
                        </View>
                    </View>
                    <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                        <TouchableOpacity onPress={() => setIsSignUp(false)}>
                            <Text style={{ textDecorationLine: 'underline', color: 'blue' }}>로그인 하러 돌아가기</Text>
                        </TouchableOpacity>
                    </View>
                </>)
                :
                (<>
                    <Text style={styles.text}>로그인 페이지</Text>
                    <TextInput stlye={styles.input} placeholder="이메일" onChangeText={(text) => setEmail(text)} value={email} />
                    <View style={{ height: 20 }} />
                    <TextInput secureTextEntry={true} placeholder="비밀번호" textContentType='password' onChangeText={(text) => setPassword(text)} value={password} />
                    <View style={{ height: 20 }} />
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ width: 150, height: 50 }}>
                            <Button title="로그인" onPress={signIn} />
                        </View>
                    </View>
                    <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                        <TouchableOpacity onPress={() => setIsSignUp(true)}>
                            <Text style={{ textDecorationLine: 'underline', color: 'blue' }}>아직 회원이 아니신가요?</Text>
                        </TouchableOpacity>
                    </View>

                </>)
            }
        </View >
    )
}

export default Login;

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        flex: 1,
        justifyContent: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 50,
    },
    form: {
        marginVertical: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        marginVertical: 4,
        flex: 1,
        height: 50,
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        backgroundColor: '#eee',
    }
})