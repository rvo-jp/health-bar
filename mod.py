import os
import json

# 編集するディレクトリ
directory = "./entity"

for filename in os.listdir(directory):
    filepath = os.path.join(directory, filename)

    name, ext = os.path.splitext(filename)
    print(name)

    # 2. json読み込み
    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)

    # 3. 編集処理
    data["minecraft:client_entity"]["description"]["spawn_egg"] = {
        "texture": "spawn_egg_" + name
    }

    # 4. 上書き保存
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)