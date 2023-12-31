const functions = require("firebase-functions");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// ユーザー情報の登録が完了したことをCustom Claimに登録
exports.registerCustomState = functions.https.onCall(async (data, context) => {
  console.log("call registerCustomState");
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "UIDがありません");
  }
  const status = data.registerStatus;
  const userUid = context.auth.uid;
  await admin.auth().setCustomUserClaims(userUid, {registerStatus: status});
  return {
    state: true,
  };
});

exports.registerColorIndex = functions.https.onCall(async (data, context) => {
  console.log("call registerColorIndex");
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "UIDがありません");
  }
  const colorIndex = data.colorIndex;
  const userUid = context.auth.uid;
  await admin.auth().setCustomUserClaims(
      userUid,
      {registerStatus: 1, colorIndex: colorIndex});
  return {
    state: true,
  };
});

exports.deleteUser = functions.firestore
    .document("deleted_users/{docId}").onCreate(async (snap, context) => {
      console.log("call deleteUser");
      const deleteDocument = snap.data();
      const uid = deleteDocument.uid;
      console.log(uid);

      await admin.auth().deleteUser(uid);
    });

// Custom Claimを削除
// exports.removeCustomStatus = functions.https.onCall((data, context) => {
//   console.log("call removeCustomStatus");
//   if (!context.auth) {
//     throw new functions.https.HttpsError("unauthenticateddddd", "UIDがありません");
//   }
//   const userUid = context.auth.uid;
//   admin.auth().setCustomUserClaims(userUid, {registerStatus: null});
//   return {
//     state: true,
//   };
// });


