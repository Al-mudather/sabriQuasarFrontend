# -*- coding: utf-8 -*-

import glob
import re
import json
import os
from pathlib import Path
from translate import Translator
from deep_translator import GoogleTranslator


def get_language_file_list():
  """
  This function gets all the language translation targets in the i18 directory
  """
  base_path = Path('src\i18n\index.js')
  default_lang = Path('src\i18n\\ar\index.js')
  language_files_list = []
  for path in Path('src/i18n/').rglob('index.js'):
    if path != base_path and path != default_lang:
      language_files_list.append(path)
  return language_files_list


def get_vue_files(base_dir):
  """
  This function gets all the vue files
  """
  vue_files = []
  for path in Path(base_dir).rglob('*.vue'):
    vue_files.append(path)
  return vue_files


def get_file_translations(read_write_file):
  """
  This function gets the translation file written translation data
  """
  try:
    # First Read the File to identify if there is any existing translation no need to over write
    en_us_file_translations = open(read_write_file, 'r', encoding="utf8").read().replace('\n', '')

    p = re.compile('{.*}')
    res = p.search(en_us_file_translations)
    json_string = en_us_file_translations[res.start():res.end() + 1]
    old_translations = json.loads(json_string)

    return old_translations
  except Exception as e:
    # print(e)
    return {}


def get_file_translation_words(file):
  """
  This function gets a file and extract from it all the strings that require translation
  """
  print("# Getting files to be translated")
  p = re.compile('\$t\(?.*?\)')
  # get translation keyword data
  to_translate = p.findall(open(file, 'r', encoding="utf8").read().replace('\n', ''))

  JsonTranslate = {}

  for label in to_translate:
    # print(label)
    lbl = label.replace('$t', '').replace('\'', '').replace('(', '').replace(')', '').replace('\"', '').strip()
    # print(lbl)
    JsonTranslate[lbl] = ''
  return JsonTranslate


def create_translation_json_file_string(file, language, old_translations, to_translate, all_words):
  """
  This function takes a file and translate all the data within that file
  """
  json_file_string = ""
  print("# Create json file")
  # translator = Translator(to_lang=language)

  print(file)

  file_name = str(file).replace('\\', "_")
  # JSON BODY
  json_file_string += f""" 
        
  "_comment_{file_name}": "{file_name}",
        
  """

  for i, label in enumerate(to_translate):
    lbl = label.replace('$t', '').replace('\'', '').replace('(', '').replace(')', '').replace('\"', '').strip()

    if lbl not in all_words:
      # Check if the label has already a transalation in hand
      translated = ''
      if old_translations.get(lbl):
        translated = old_translations.get(lbl)
      else:
        print("[*] Translating using internet ...")
        translated = GoogleTranslator(source='ar', target=language).translate(lbl)
        # translated = translator.translate(lbl)
        if "MYMEMORY WARNING" in translated:
          print("[*] Memory warning ..")
          translated = ''

      json_file_string += f""" 
      "{lbl}" : "{translated}",
"""
      all_words.append(lbl)

  return json_file_string, all_words


def write_translation(read_write_file, json_file_string):
  # START JS FILE
  print("# Writing the translation")
  file_string = """

/** 
* Created By : Ibrahim Algadi
* Title      : Automated collection of JavaScript Files And Translation Using Python
*              Integration with i18n
*/


export default """

  file_string += json_file_string
  # END JS FILE

  print(file_string)

  tr_file = open(read_write_file, 'w', encoding="utf8")

  tr_file.write(file_string)

  tr_file.close()


def main():
  # get language translation files
  tr_files = get_language_file_list()

  vue_files = get_vue_files('./src/')

  # get all targeted files
  target_tr_files = get_vue_files('./src/')
  for tr_file in tr_files:
    language = str(tr_file).split('\\')[-2]
    if language != 'ar':
      # print(language)
      # get the old translation in the tr file
      old_translations = get_file_translations(read_write_file=tr_file)

      all_words = []

      translation_json = "{\n"
      # For every file get the translations needed and append it to the translation string
      for file in vue_files:
        to_translate = get_file_translation_words(file)
        if to_translate:
          translated = ''

          translated, all_words = create_translation_json_file_string(file,
                                                                      language=language,
                                                                      old_translations=old_translations,
                                                                      to_translate=to_translate,
                                                                      all_words=all_words)

          translation_json += translated

    translation_json = translation_json[:translation_json.rindex(',')] + "\n}"

    print(translation_json)

    write_translation(read_write_file=tr_file, json_file_string=translation_json)


if __name__ == '__main__':
  main()
