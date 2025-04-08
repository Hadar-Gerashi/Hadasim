import pandas as pd
import math
from collections import defaultdict
from datetime import datetime


# בדיקות תקינות
def health_checks(date_str, value):
    if is_valid_value(value) and is_valid_date(date_str):
        return True
    return False


# בדיקת תקינות לפורמט תאריך
def is_valid_date(date_str):
    try:
        datetime.strptime(date_str, "%d/%m/%Y")
        return True
    except ValueError:
        return False


# בדיקת תקינות לערך
def is_valid_value(value):
    if value:
        try:
            num_value = float(value)
            if math.isnan(num_value):
                return False
            return True
        except ValueError:
            return False
    return False


# קבלת היום מתוך פורמט תאריך
def day_from_date(date_str):
    date_obj = datetime.strptime(date_str, "%d/%m/%Y")
    day = date_obj.day
    return day


# בדיקת כפילויות והעתקת השורות התקינות לקובץ אחר
def duplicates(file_path):
    # בדיקה איזה סיומת קובץ מורץ
    if file_path.endswith('.csv'):
        df = pd.read_csv(file_path)
    elif file_path.endswith('.parquet'):
        df = pd.read_parquet(file_path)
        df = df.rename(columns={'mean_value': 'value'})
        df['timestamp'] = pd.to_datetime(df['timestamp'], dayfirst=True).dt.strftime('%d/%m/%Y %H:%M:%S')

    seen_timestamps = set()
    good_rows = []

    for row in df.itertuples(index=False):
        timestamp = row.timestamp
        value = row.value

        # פירוק תאריך ושעה
        date_hour = timestamp.split(" ")
        date = date_hour[0]

        # בדיקת תקינות ובדיקה שאין כפילויות
        if health_checks(str(date), str(value)) and timestamp not in seen_timestamps:
            # שמירה במערך השורות הטובות
            good_rows.append(row)
            # שמירה בset למנוע כפילויות
            seen_timestamps.add(timestamp)

    # יצירת DataFrame חדש מהשורות התקינות
    df_cleaned = pd.DataFrame(good_rows)

    # החזרת שם הקובץ התקין כדי לעבוד עליו
    if file_path.endswith('.csv'):
        df_cleaned.to_csv("cleaned_data.csv", index=False)
        return 'cleaned_data.csv'
    elif file_path.endswith('.parquet'):
        df_cleaned.to_parquet("cleaned_data.parquet", index=False)
        return 'cleaned_data.parquet'


# סעיף א
# חישוב הממוצעים של הקובץ התקין
def write_average(file_path):
    # קבלת הקובץ התקין לאחר הסרת השורות השגויות
    correct_file = duplicates(file_path)
    # שליחה לפונקציה שמחשבת ממוצע לקובץ הזה ומחזירה defaultdict
    timestamp_averages = calculate_averages(correct_file)

    rows = []
    for timestamp, (total, count) in timestamp_averages.items():
        avg = total / count
        formatted_timestamp = f"{timestamp}:00"
        rows.append({'timestamp': formatted_timestamp, 'average': avg})

    # המרה ל-DataFrame
    avg_df = pd.DataFrame(rows)

    # שמירה לקובץ
    avg_df.to_csv(f'average_{file_path}.csv', index=False)


# חישוב ממוצעים לכל חלק בנפרד לעא עי כתיבה לקובץ
def calculate_averages(file_path):
    if file_path.endswith('.csv'):
        df = pd.read_csv(file_path)
    elif file_path.endswith('.parquet'):
        df = pd.read_parquet(file_path)

    # מילון מיוחד שישמור לכל תאריך ושעה סכום וכמות
    timestamp_averages = defaultdict(lambda: [0.0, 0])

    for row in df.itertuples(index=False):
        timestamp_row = row.timestamp
        value_row = row.value
        # קבלת חותמת הזמן כולל השעה בלבד בלי הדקות או גם השניות
        timestamp = timestamp_row.split(" ")[0] + " " + timestamp_row.split(" ")[1].split(":")[0]
        # המרה לערך float
        value = float(value_row)
        timestamp_averages[timestamp][0] += value  # הוספת הערך לסכום
        timestamp_averages[timestamp][1] += 1  # עדכון הכמות

    return timestamp_averages


# סעיף ב
# חישוב הממוצעים של הקובץ התקין אבל עי חלוקה לחלקים קטנים ואז חישוב כל חלק וחיבור התוצאות
def split_data_and_write_average(file_path):
    # קבלת הקובץ התקין
    correct_file = duplicates(file_path)

    if file_path.endswith('.csv'):
        correct = pd.read_csv(correct_file)
    elif file_path.endswith('.parquet'):
        correct = pd.read_parquet(correct_file)
        correct = correct.rename(columns={'mean_value': 'value'})
        correct['timestamp'] = pd.to_datetime(correct['timestamp'], dayfirst=True).dt.strftime('%d/%m/%Y %H:%M:%S')

    date_rows = defaultdict(list)

    # הפרדה לפי תאריך
    for row in correct.itertuples(index=False):
        timestamp_row = row.timestamp
        value_row = row.value
        date_str = str(timestamp_row).split(" ")[0]
        dt = datetime.strptime(date_str, '%d/%m/%Y')
        safe_date = dt.strftime('%d-%m-%y')
        date_rows[safe_date].append((timestamp_row, value_row))

    # פתיחת קובץ הממוצעים לכתיבה מיידית
    with open('average_time_series.csv', 'w') as all_date_file:
        all_date_file.write('timestamp,average\n')

        # יצירת קבצים לכל תאריך + חישוב ממוצעים
        for safe_date, rows in date_rows.items():
            date_file_name = f'{safe_date}_time_series.csv'

            with open(date_file_name, 'w') as date_part_file:
                date_part_file.write('timestamp,value\n')
                for timestamp_row, value_row in rows:
                    date_part_file.write(f"{timestamp_row},{value_row}\n")

            # חישוב ממוצעים לפי שעה עבור הקובץ הזה
            timestamp_averages = calculate_averages(date_file_name)

            for timestamp, (total, count) in timestamp_averages.items():
                avg = total / count
                date_hour = timestamp.split(" ")
                all_date_file.write(f'{date_hour[0]} {date_hour[1]}:00,{avg}\n')

# סעיף א
# duplicates('time_series.csv')

# סעיף ב 1
# write_average('time_series.csv')

# סעיף ב 2
# split_data_and_write_average('time_series.csv')

# סעיף 3
# כאשר הנתונים לא מגיעים מתוך קובץ אחד גדול, אלא באופן שוטף ובלתי פוסק (stream)
# צריך לעבד כל רשומה ברגע שהיא מתקבלת, ולעדכן את הממוצעים השעתיים בזמן אמת
# נחלץ מהחותמת את השעה המתאימה כמו שעשינו עד עכשיו
# במקום לשמור את כל הערכים מהזרם, נשמור לכל שעה רק:
# סכום כולל של הערכים שהתקבלו בשעה זו
# מספר הערכים שהתקבלו בשעה זו
#  ואז נוכל לחשב ממוצע מיידית
# בכל פעם שמתקבל ערך חדש:
# מזהים לאיזו שעה הוא שייך
# מעדכנים את הסכום והכמות
# מחשבים את הממוצע השעתי המעודכן


# סעיף 4
# write_average('time_series.parquet')
split_data_and_write_average('time_series.parquet')

# יתרונות אחסון בparquet:
# פורמט Parquet מאפשר לאחסן נתונים מסוגים מורכבים יותר כמו מערכים, מבנים מקוננים, ונתונים היררכיים.
# לדוגמה, אם יש לנו שדות של רשימות או מבני נתונים מעמיקים , Parquet יכול לשמור אותם בצורה נוחה ומסודרת.
# וכן פורמט Parquet שומר נתונים לפי עמודות ולא לפי שורות,
# כך שניתן לגשת רק לעמודות מסוימות מבלי לקרוא את כל הנתונים.
# זה מאוד יעיל במיוחד כשאנו צריכים לעבד נתונים מעמודות ספציפיות בלבד.
# בנוסף להכל בשל מבנה הדחיסה המובנה שלו,
# קבצי Parquet לרוב יטענו מהר יותר מ-CSV כאשר עובדים עם נתונים גדולים מאוד
# . זאת מכיוון ש-Parquet גם שומר על אינדקסים ברקע שמאפשרים טעינה מהירה וממוקדת של הנתונים.
#
