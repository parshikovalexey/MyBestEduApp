import os
import sys
import whisper
import time
import subprocess
import shutil
from pathlib import Path


def check_ffmpeg():
    if shutil.which("ffmpeg"):
        return True
    result = subprocess.run(["ffmpeg", "-version"], capture_output=True, text=True)
    return result.returncode == 0


def extract_audio(video_path, temp_audio_path):
    cmd = [
        "ffmpeg", "-y", "-i", video_path,
        "-vn", "-acodec", "pcm_s16le",
        "-ar", "16000", "-ac", "1",
        temp_audio_path
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"FFmpeg error: {result.stderr}")
        return False
    return True


def transcribe_video(video_path, model_size="base", language=None):
    video_path = Path(video_path)
    
    if not video_path.exists():
        print(f"File not found: {video_path}")
        return None
    
    # Определяем путь для сохранения .txt
    output_path = video_path.with_suffix(".txt")
    
    # Если .txt уже существует, спрашиваем перезапись
    if output_path.exists():
        overwrite = input(f"Файл {output_path.name} уже существует. Перезаписать? (y/n): ").strip().lower()
        if overwrite != 'y':
            print("Отменено.")
            return None
    
    print(f"Loading Whisper model ({model_size})...")
    model = whisper.load_model(model_size)
    
    temp_audio = video_path.parent / f"temp_audio_{int(time.time())}.wav"
    
    print(f"Extracting audio from: {video_path.name}")
    if not extract_audio(str(video_path), str(temp_audio)):
        print("Failed to extract audio")
        return None
    
    print("Transcribing...")
    start_time = time.time()
    
    kwargs = {"task": "transcribe", "fp16": False}
    if language:
        kwargs["language"] = language
    
    result = model.transcribe(str(temp_audio), **kwargs)
    elapsed = time.time() - start_time
    
    # Удаляем временный аудиофайл
    if temp_audio.exists():
        os.remove(temp_audio)
    
    transcript = result["text"].strip()
    
    # Сохраняем в файл с тем же именем, но .txt
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(transcript)
    
    print(f"Done! Time: {elapsed:.1f}s")
    print(f"Saved to: {output_path}")
    
    return transcript


def main():
    if not check_ffmpeg():
        print("ERROR: FFmpeg not found!")
        print("Install: winget install ffmpeg  OR  https://ffmpeg.org/download.html")
        sys.exit(1)
    
    # Запрашиваем полный путь к файлу
    video_path = input("Enter full path to video file: ").strip().strip('"')
    
    if not video_path:
        print("No path provided")
        sys.exit(1)
    
    # Если ввели только имя файла, ищем в текущей папке
    if not os.path.isabs(video_path):
        video_path = os.path.abspath(video_path)
    
    model_size = input("Model size (tiny/base/small/medium/large) [base]: ").strip() or "base"
    language = input("Language (or empty for auto): ").strip() or None
    
    print("\n" + "=" * 50)
    transcribe_video(video_path, model_size, language)


if __name__ == "__main__":
    main()