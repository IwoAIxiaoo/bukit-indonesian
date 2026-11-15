# 第三方来源与署名

## 合成语音

`audio/` 中的大部分音频由 Meta 的 **MMS-TTS 印尼语模型**（[facebook/mms-tts-ind](https://huggingface.co/facebook/mms-tts-ind)）生成。该模型以 **CC BY-NC 4.0** 发布，生成的音频在本仓库中同样按 CC BY-NC 4.0 提供，不得用于商业用途。

> Pratap et al., *Scaling Speech Technology to 1,000+ Languages*, 2023.

生成时用的是 sherpa-onnx 导出的 ONNX 版本。单词和字母的做法是把词放在一句话的末尾合成，再按模型输出的时长把它剪出来，每个词生成 3 个候选，用语音识别挑出最准的一个。

## 真人录音

397 个单词的真人录音（多数词有 2–3 位说话人）来自 **MLCommons 的多语种口语词语料库（Multilingual Spoken Words Corpus，MSWC）**，以 **CC BY 4.0** 发布：
https://huggingface.co/datasets/MLCommons/ml_spoken_words

MSWC 是从 **Mozilla Common Voice** 志愿者朗读的句子中，用强制对齐自动切出的单词。

> Mazumder et al., *Multilingual Spoken Words Corpus*, NeurIPS Datasets and Benchmarks, 2021.

本仓库对这些录音做了修改：裁掉首尾静音、加淡入淡出、滤掉 70 Hz 以下的低频、统一响度，并转成 MP3。哪些词用了真人录音、各有几种读法，记录在 `audio/index.json` 的 `human` 和 `var` 字段里。

按照数据集的要求：**请不要尝试识别录音中说话人的身份。**

## 字体

离线版内嵌了两种字体的子集，均以 **SIL Open Font License 1.1** 发布，许可全文在 `fonts/` 目录：

- **Plus Jakarta Sans**，© The Plus Jakarta Sans Project Authors
- **Charis SIL**，© SIL International

字体文件取自 [Fontsource](https://fontsource.org/)。

## 参考过的做法

“今日学习”把复习、新词、默写串成一次，以及错词本、跟打、听写、句子连播和跟读、短文阅读这几种练习形式，参考了开源项目 [TypeWords](https://github.com/zyronon/TypeWords)（GPL-3.0）的功能思路。本仓库**没有使用、也没有改写它的任何代码或素材**，这些功能都是另行实现的。

## 只在制作过程中用到、仓库里不包含的东西

- **Whisper large-v3-turbo**（通过 faster-whisper）：用来检查合成语音和真人录音能否被正确识别，从而筛选音频。
- **Playwright**：运行 `tools/` 里的测试。

## 商标

仓库中提到的 Claude、Anthropic、Meta、Mozilla、Common Voice、WhatsApp、Gojek、Grab 等名称是各自所有者的商标，在这里只用于说明来源或举例，不表示任何合作或背书关系。
