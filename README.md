# ilab-bot-storage-dao

## 概要

iLab Bot用ストレージにアクセスするためのLambda関数

## 関数一覧

### get.js

指定したkeyに紐づくvalueを返す

***event***
```json
{
  "key":"keyOfValue"
}
```
***戻り値***
* 格納されたvalue(string,int,json,etc...)
  * key自体が存在しない場合はnull

### set.js

指定したkeyにvalueを格納する
(既にkeyが格納されていれば更新、そうでなければ新規追加)

***event***
```json
{
  "key":"someKey",
  "value":{"someDataKey":"someDataValue"}
}
```

***戻り値***

null

### unset.js

指定したkeyとそれに紐づくvalueを削除する

***event***
```json
{
  "key":"keyForDelete"
}
```

***戻り値***

null
