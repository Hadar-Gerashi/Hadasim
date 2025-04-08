
-- חלק ב
-- יצירת הטבלאות 

CREATE DATABASE FamilyConnectionDB
GO
USE FamilyConnectionDB
GO


CREATE TABLE persons_tbl (
    person_id INT IDENTITY(1,1) PRIMARY KEY,
    first_name VARCHAR(25) NOT NULL,
    last_name VARCHAR(25) NOT NULL,
    gender CHAR(1) CHECK (gender IN ('M', 'F')) NOT NULL, 
    father_id INT,
    mother_id INT,
    spouse_id INT,
    FOREIGN KEY (father_id) REFERENCES persons_tbl(person_id),  
    FOREIGN KEY (mother_id) REFERENCES persons_tbl(person_id),  
    FOREIGN KEY (spouse_id) REFERENCES persons_tbl(person_id) 
);

CREATE TABLE family_tree_tbl (
    person_id INT,
    relative_id INT,
    connection_type VARCHAR(25),
    PRIMARY KEY (person_id, relative_id),
    FOREIGN KEY (person_id) REFERENCES persons_tbl(person_id),
    FOREIGN KEY (relative_id) REFERENCES persons_tbl(person_id),
    CHECK (connection_type IN ('Father', 'Mother', 'Brother', 'Sister', 'Son', 'Daughter','Husband','Wife'))
)



-- הכנסת נתונים לטבלת persons_tbl

INSERT INTO persons_tbl (first_name, last_name, gender, father_id, mother_id, spouse_id)
VALUES
('John', 'Smith', 'M', NULL, NULL, NULL),
('Jane', 'Smith', 'F', NULL, NULL, 1),
('Michael', 'Johnson', 'M', 1, 2, NULL),
('Emily', 'Johnson', 'F', NULL, NULL, 3),
('David', 'Williams', 'M', 3, 4, NULL),
('Jessica', 'Williams', 'F', NULL, NULL, 5),
('Christopher', 'Brown', 'M', 5, 6, NULL),
('Ashley', 'Brown', 'F', 5, 6, NULL),
('Matthew', 'Davis', 'M', 5, 6, NULL),
('Amanda', 'Davis', 'F', 5, 6, NULL),
('Liron', 'Danin', 'F', NULL, NULL, NULL),
('Betzalel', 'Danin', 'M',NULL, NULL, 11);



-- חלק 1

--פונקציה שמקבלת את ה - id
--של בן אדם ושל קרוב משפחתו ואם יש שורה של קרבה כזאת אז יחזיר 0 אחרת  1
CREATE FUNCTION CheckIfNotExist (@person_id INT, @relative_id INT)
RETURNS BIT
AS
BEGIN
    DECLARE @result CHAR(1);

    IF NOT EXISTS (
        SELECT 1
        FROM family_tree_tbl
        WHERE person_id = @person_id
        AND relative_id = @relative_id
    )
        SET @result = 1;
    ELSE
        SET @result = 0; 

    RETURN @result;
END;




-- טריגר להוספה ועדכון של שורות
CREATE TRIGGER trg_family_tree_tbl
ON persons_tbl
AFTER INSERT, UPDATE
AS
BEGIN

      DECLARE @count_people INT ,@index INT=1,
        @father_id INT, @mother_id INT, @spouse_id INT,@person_id INT,@gender CHAR(1),
        @relationship_type VARCHAR(20)


      SELECT @count_people = COUNT(*) FROM inserted

      -- טבלה זמנית של persons_tbl
      CREATE TABLE #temp_persons (
          person_id INT, 
          father_id INT,
          mother_id INT,
          spouse_id INT,
          gender CHAR(1),
          RowNum INT
      );

      -- הכנסת נתונים לטבלה הזמנית
      INSERT INTO #temp_persons (person_id, father_id, mother_id, spouse_id, gender, RowNum)
          SELECT person_id, father_id, mother_id, spouse_id, gender, 
              ROW_NUMBER() OVER (ORDER BY person_id) AS RowNum
          FROM inserted;


      WHILE @index <= @count_people
        BEGIN
          -- שליפה של כל שורה בנפרד
          SELECT @person_id = person_id, @father_id = father_id, @mother_id = mother_id,
		         @spouse_id = spouse_id,@gender = gender
          FROM #temp_persons
          WHERE RowNum = @index;

          SET @relationship_type = CASE 
                WHEN @gender = 'M' THEN 'Son'
                WHEN @gender = 'F' THEN 'Daughter'
              END;


		--בדיקה אם יש לו אבא ואין כבר שורה כזאת במקרה של עדכון הטריגר אז נעדכן 
       IF @father_id IS NOT NULL    
          AND dbo.CheckIfNotExist(@person_id, @father_id)=1
          BEGIN
          INSERT INTO family_tree_tbl (person_id, relative_id, connection_type)
          VALUES
          (@person_id, @father_id,'Father' ),
          (@father_id, @person_id, @relationship_type)
        END


		--בדיקה אם יש לו אם ואין כבר שורה כזאת במקרה של עדכון הטריגר אז נעדכן 
       IF @mother_id IS NOT NULL
	      AND dbo.CheckIfNotExist(@person_id, @mother_id)=1
           BEGIN
           INSERT INTO family_tree_tbl (person_id, relative_id, connection_type)
           VALUES
           (@person_id, @mother_id,'Mother' ),
           (@mother_id, @person_id, @relationship_type)
        END

		--בדיקה אם יש לו בן/בת זוג ואין כבר שורה כזאת במקרה של עדכון הטריגר אז נעדכן 
        IF @spouse_id IS NOT NULL
	     AND dbo.CheckIfNotExist(@person_id, @spouse_id)=1
          BEGIN
          INSERT INTO family_tree_tbl (person_id, relative_id, connection_type)
          VALUES
          (@person_id, @spouse_id,  CASE 
            WHEN @gender = 'M' THEN 'Wife'
            WHEN @gender = 'F' THEN 'Husband'
          END )
        END  



		-- הוספת האחים לטבלה
       INSERT INTO family_tree_tbl (person_id, relative_id, connection_type)
       SELECT @person_id, person_id, 
              CASE 
                  WHEN gender = 'M' THEN 'Brother'
                  WHEN gender = 'F' THEN 'Sister'
              END
       FROM persons_tbl
       WHERE father_id = @father_id 
         AND mother_id = @mother_id 
         AND person_id != @person_id
		 AND dbo.CheckIfNotExist(@person_id, person_id)=1



		  --קידום הלולאה
		 SET @index += 1

  END
END



-- חלק 2  
CREATE PROCEDURE UpdateSpouseId
AS
BEGIN
  UPDATE p1
  SET spouse_id = p2.person_id
  FROM persons_tbl p1
  JOIN persons_tbl p2 
      ON p1.person_id = p2.spouse_id
  WHERE p1.spouse_id IS NULL
  AND p2.spouse_id IS NOT NULL;
  PRINT 'completed'
END




EXEC UpdateSpouseId
select * from persons_tbl
select * from family_tree_tbl
