const oracledb = require('oracledb');
const session = require('express-session');
oracledb.fetchAsString = [oracledb.CLOB];

let pool;

// 연결 정보 설정
const connect = {
    user: 'yjchoi',
    password: 'dudwns123',
    connectString: '192.168.0.21:1521/YJCHOI', // Oracle SID 또는 서비스 이름
    dateStrings: true,
};

// 오라클 풀 생성
async function createPool() {
    try {
        pool = await oracledb.createPool({
            user: connect.user,
            password: connect.password,
            connectString: connect.connectString,
            poolAlias: 'testPool', // 원하는 풀의 별칭
            poolMin: 1,
            poolMax: 10,
            poolIncrement: 1,
            poolTimeout: 60,
            queueTimeout: 60000,
        });

        console.log('Oracle 풀이 생성되었습니다.');
    } catch (err) {
        console.error('Oracle 풀 생성 중 오류:', err);
    }
}

// 풀 해제
async function closePool() {
    try {
        await oracledb.getPool().close();
        console.log('Oracle 풀이 닫혔습니다.');
    } catch (err) {
        console.error('Oracle 풀 닫기 중 오류:', err);
    }
}

// 연결 가져오기
async function getConnection() {
    try {
        if (!pool) {
            console.error('Oracle 풀이 생성되지 않았습니다. 먼저 createPool 함수를 호출하세요.');
            return null;
        }
        const connection = await pool.getConnection();
        console.log('Oracle 연결이 성공적으로 얻어졌습니다.');
        return connection;
    } catch (err) {
        console.error('Oracle 연결 가져오기 중 오류:', err);
        return null;
    }
}

module.exports = {
    createPool,
    closePool,
    getConnection
};