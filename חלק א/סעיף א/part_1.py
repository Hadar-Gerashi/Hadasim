from collections import defaultdict, Counter


# סעיף 1
# חלוקת קובץ הלוג לחלקים קטנים יותר
# והחזרת מספר הקבצים שנוצרו
def split_log_file_into_parts(file_path, part_size=10000):
    line_count = 0
    index = 0
    # מערך שורות זמני כדי שהכתיבה לקובץ תיהיה יותר מהירה
    lines_buffer = []

    with open(file_path, 'r') as logs_file:
        for line in logs_file:
            lines_buffer.append(line)
            line_count += 1

            # כל 10000 שורות חילקתי לקובץ נפרד
            if line_count % part_size == 0:
                with open(f"part_{index}.txt", 'w') as part_file:
                    part_file.writelines(lines_buffer)
                index += 1
                # ניקוי המערך עזר
                lines_buffer = []

        # אם נשארו שורות אחרונות, כתוב אותן
        if lines_buffer:
            with open(f"part_{index}.txt", 'w') as part_file:
                part_file.writelines(lines_buffer)

    return index


# סעיף 2
# ספירת שכיחות לכל חלק
# והחזרת הספירה שזה הcounter
def count_error_frequencies_in_part(file_path):
    # counter לסכימת שכיחות קודי השגיאה לחלק זה
    part_error_counts = Counter()
    with open(file_path, 'r') as file:
        for line in file:
            line = line.strip().strip('"')
            error_code = line.split(',')[1]
            part_error_counts[error_code] += 1
    return part_error_counts


# סעיף 3
# חיבור ספירת השכיחויות מכל החלקים
# ןהחזרת החישוב הכולל
def merge_error_counts(all_counts):
    # counter לכל החלקים ביחד
    total_count = Counter()
    # מעבר על מערך החלקי שכיחות והוספת כל חלק לcounter
    for count in all_counts:
        total_count.update(count)
    return total_count


# סעיף 4
# מציאת N הקודי שגיאה השכיחים ביותר
def finding_N_error_codes(file_path, N):
    all_counts = []
    # הפעלת פונקציה החלוקה לחלקים קטנים והחזרת הindex שזה כמות הקבצים שנוצרו
    count_file = split_log_file_into_parts(file_path)
    for file in range(count_file):
        part_count = count_error_frequencies_in_part(f"part_{file}.txt")
        all_counts.append(part_count)
    total_count = merge_error_counts(all_counts)
    top_N = total_count.most_common(N)
    return top_N


print(finding_N_error_codes('log.txt', 5))

# סיבוכיות זמן
# split_log_file_into_parts -  זה מספר השורות בקובץ שהתקבל- n כאשר o(n) - סיבוכיות זמן של פונקציה זו
# כי עוברים על כל השורות פעם אחת וכותבים לקובץ שזה סיבוכיות זמן לפי אורך השורה
# אך אורך השורה קבוע בכל השורות לכן זה o(n)
# for file in range(count_file): - על הלולאה הזאת הוא יעבור כמספר הקבצים
# וישלח כל אחד לפונקציה count_error_frequencies_in_part - שהיא עוברת על כל שורה
# o(n) שזה
# כי בסוף הוא יעבור עוד פעם על כל השורות - פעם אחת
# merge_error_counts -o(k*p) פונקציה שמאחדת את חלקי שכיחויות של השגיאות לקאונטר אחד וזה סיבוכיות
# כך שp זה מספר הקאונטר של שכיחויות הקודים של הקבצים שנוצרו וכל אחד מ־p Counters תורם עד k ערכים שונים
# ובמקרה הגרוע אין חפיפות בין הקבצים
# top_N = total_count.most_common(N) - סיבוכיות o(k log N)
#  כאשר k זה מספר הפריטים הכולל ב-counter וN הוא מספר הפריטים שרוצים להחזיר
# כי הפעולה הזאת משתמשת במבנה נתונים פנימי - ערימה
# כי הכנסה לערימה זה log N אבל יתכן שאני יצטרך לעשות זאת n פעמים
# לכן הסיבוכיות זמן זה o(n)+o(p*k)+o(k log N)


# סיבוכיות מקום
# יש את מערך lines_buffer שמכיל כל פעם 10000 שורות שזה משהו קבוע אז זה o(1)
# part_error_counts  o(k)  שמכיל את מספר קודי השגיאות אז נניח שזה counter זה
# כך שk זה מספרק קודי השגיאות
# total_count- o(k) זה גם כן מכיל את סך מספר קודי השגיאה אז זה גם
# top_N	- מכיל את הN השכיחים ביותר שהוא ודאי קטן מk לכן לא נחשיב את זה-
# all_counts = [] - o(n/p) גודלו לפי כמות הקבצים שהקובץ שהתקבל התחלק לכן זה
# כך שn זה מספר שורות בקובץ שהתקבל וp זה ה100000 שורות שחילקנו לפי זה
# וכל זה כפול k כי במקרה הגרוע לכל אחד ישמר שם כל הקודי שגיאה שיש
# אז זה o(n/p *k)
# לכן סיבוכיות מקום זה: o(n/p *k)+o(k)




# דרך אחרת שלא עובדת לפי השלבים בדרישה נראה לי יותר יעילה
# אין קבצים זמניים – חוסך כתיבה/קריאה לדיסק, שזה איטי
# פחות זיכרון – לא שומרת רשימת קאונטרים כמו all_counts, רק מילון אחד (סיבוכיות מקום O(k))
# יותר יעילה – מעבדת תוך כדי קריאה, לא צריך איחוד של קאונטרים אח״כ
# מחזירה את ה־N הכי שכיחים בלי לשמור את כל הקאונטר בזיכרון – בזכות heapq

from collections import defaultdict
import heapq


# פונקציה שמקבלת קובץ טקסט גדול ומםפר שלם N ומחזירה את N קודי השגיאה השכיחים ביותר ואת ספרותיהם
def count_errors_in_parts(file_path, N):
    # מילון כללי לכל הטעויות של קודי השגיאה
    error_dict = defaultdict(int)
    max_heap = []

    with open(file_path, 'r') as logs_file:
        # רשימה זמנית ל-10000 השורות הקרובות
        list_part = []
        for line in logs_file:
            list_part.append(line.strip().strip('"'))

            if len(list_part) == 10000:
                # שהגענו למקסימום שורות לכל חלק נשלח את הרשימה של החלק העכשווי ואת מילון השגיאות שיטפל בשורות האלה
                process_part(list_part, error_dict)
                # נאתחל את רשימת ה10000 שורות לריקה בשביל הפעם הבאה
                list_part = []

        # לפעם האחרונה שכבר יכול להיות פחות מ10000 שורות
        if list_part:
            process_part(list_part, error_dict)

    for error_code, count in error_dict.items():
        heapq.heappush(max_heap, (count, error_code))

        if len(max_heap) > N:
            heapq.heappop(max_heap)

    return sorted(max_heap, key=lambda x: x[0])


# פונקציה שמקבלת רשימה של 10000 שורות נוכחיות ומילון של קודי השגיאה ובמעבר על הרשימה היא מעדכנת את המילון
def process_part(list_part, error_dict):
    for line in list_part:
        error_code = line.split()[-1]
        error_dict[error_code] += 1

# error_counts = count_errors_in_parts('log.txt', 5)
# print(error_counts)

# סיבוכיות זמן והמקום:

# סיבוכיות זמן:

# על כל שורה בסוף מה שנעשה זה:
# 1. list_part.append(line.strip().strip('"'))
# 2. error_code = line.split()[-1]
# 3. error_dict[error_code] += 1
# שורה ראשונה(1) זה תלוי באורך השורה אבל אורכי השורות זה דבר קבוע לפי הקובץ המצורף ולא משתנה אז זה o(1)
# שורה שניה(2) זה גם כן תלוי באורך השורה לכן זה כמו שהובהר ולכן סיבוכיות זה o(1)
# ושורה שלישית(3) ודאי זה o(1)
# לכן אם זה מה שקורה לכל השורות ויש לנו n שורות בקובץ
# אז סיבוכיות זמן זה o(n)
# יש את הלולאה שעוברת על שכיחות קודי השגיאה ומכניסה בסוף לערימה רק את N שכיחים אז זה o(k log N)
# ואחרי זה שורה שממינת את הערימה מהגבוה לנמוך סתם בשביל התצוגה של הפלט שזה כמובן o(N log N) שזה מיון הכי יעיל
# אך N קטן שווה לK כי זה חלק ממנו לכן ביחד זה סיבוכיות o(k log N)
# אז הסיבוכיות היא הסיבוכיות הכללית היא o(n)+o(k log N)


# סיבוכיות מקום:
# list_part - זה רשימה שמכילה 10000 שורות כל פעם כך שכל שורה באורך קבוע כפי שהוסבר מקודם
# לכן זה אמור להיות o(m*10000) כך שm זה אורך שורה אבל כיוון שזה מספרים קבועים אפשר להחשיב זאת כ-o(1)
# error_dict-  o(k) זה מילון שמכיל את שכיחות קודי השגיאה ולכן זה
# לפי כמות הקודי שגיאה שבקובץ
# כך שk זה כמות קודי השגיאה
# max_heap- N זה ערימה שמכילה לי את
#  קודי השגיאה השכיחים ביותר אז זה o(N)
# אך N קטן שווה לk כי הוא חלק מתוכו לכן o(k)+o(N)=o(k)
# לכן סיבוכיות מקום זה o(k)
