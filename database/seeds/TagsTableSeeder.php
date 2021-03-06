<?php

use Illuminate\Database\Seeder;

class TagsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $tags = array(
            array( // row #0
                'id' => 1,
                'name' => 'Cafe Sáng',
                'slug' => 'cafe-sang',
                'created_at' => '2017-10-26 03:42:33',
                'updated_at' => '2017-10-26 03:42:33',
            ),
            array( // row #1
                'id' => 2,
                'name' => 'Highland',
                'slug' => 'highland',
                'created_at' => '2017-10-26 03:42:33',
                'updated_at' => '2017-10-26 03:42:33',
            ),
            array( // row #2
                'id' => 3,
                'name' => 'Solo',
                'slug' => 'solo',
                'created_at' => '2017-10-26 03:42:33',
                'updated_at' => '2017-10-26 03:42:33',
            ),
            array( // row #3
                'id' => 4,
                'name' => 'Chủ Nhật',
                'slug' => 'chu-nhat',
                'created_at' => '2017-10-26 03:47:05',
                'updated_at' => '2017-10-26 03:47:05',
            ),
            array( // row #4
                'id' => 5,
                'name' => 'Street',
                'slug' => 'street',
                'created_at' => '2017-10-26 03:48:25',
                'updated_at' => '2017-10-26 03:48:25',
            ),
            array( // row #5
                'id' => 6,
                'name' => 'Wildlife',
                'slug' => 'wildlife',
                'created_at' => '2017-10-26 03:48:25',
                'updated_at' => '2017-10-26 03:48:25',
            ),
            array( // row #6
                'id' => 7,
                'name' => 'Feel',
                'slug' => 'feel',
                'created_at' => '2017-10-26 03:48:56',
                'updated_at' => '2017-10-26 03:48:56',
            ),
            array( // row #7
                'id' => 8,
                'name' => 'Lang Thang',
                'slug' => 'lang-thang',
                'created_at' => '2017-10-26 03:48:56',
                'updated_at' => '2017-10-26 03:48:56',
            ),
            array( // row #8
                'id' => 9,
                'name' => 'Tình',
                'slug' => 'tinh',
                'created_at' => '2017-10-26 03:48:56',
                'updated_at' => '2017-10-26 03:48:56',
            ),
            array( // row #9
                'id' => 10,
                'name' => 'Ngẫm',
                'slug' => 'ngam',
                'created_at' => '2017-10-26 03:49:28',
                'updated_at' => '2017-10-26 03:49:28',
            ),
            array( // row #10
                'id' => 11,
                'name' => 'Phong Cảnh',
                'slug' => 'phong-canh',
                'created_at' => '2017-10-26 03:50:00',
                'updated_at' => '2017-10-26 03:50:00',
            ),
            array( // row #11
                'id' => 12,
                'name' => 'Nhớ Em',
                'slug' => 'nho-em',
                'created_at' => '2017-10-26 03:50:36',
                'updated_at' => '2017-10-26 03:50:36',
            ),
            array( // row #12
                'id' => 13,
                'name' => 'Tâm Sự',
                'slug' => 'tam-su',
                'created_at' => '2017-10-26 03:51:56',
                'updated_at' => '2017-10-26 03:51:56',
            ),
            array( // row #13
                'id' => 14,
                'name' => 'Cafe',
                'slug' => 'cafe',
                'created_at' => '2017-10-26 03:51:56',
                'updated_at' => '2017-10-26 03:51:56',
            ),
            array( // row #14
                'id' => 15,
                'name' => 'Một Mình',
                'slug' => 'mot-minh',
                'created_at' => '2017-10-26 03:51:56',
                'updated_at' => '2017-10-26 03:51:56',
            ),
            array( // row #15
                'id' => 16,
                'name' => 'Yêu',
                'slug' => 'yeu',
                'created_at' => '2017-10-26 03:52:27',
                'updated_at' => '2017-10-26 03:52:27',
            ),
            array( // row #16
                'id' => 17,
                'name' => 'Tình Cảm',
                'slug' => 'tinh-cam',
                'created_at' => '2017-10-26 03:52:27',
                'updated_at' => '2017-10-26 03:52:27',
            ),
            array( // row #17
                'id' => 18,
                'name' => 'Chờ Đợi',
                'slug' => 'cho-doi',
                'created_at' => '2017-10-26 03:52:50',
                'updated_at' => '2017-10-26 03:52:50',
            ),
            array( // row #18
                'id' => 19,
                'name' => 'Em',
                'slug' => 'em',
                'created_at' => '2017-10-26 03:52:50',
                'updated_at' => '2017-10-26 03:52:50',
            ),
            array( // row #19
                'id' => 20,
                'name' => 'Font',
                'slug' => 'font',
                'created_at' => '2017-10-26 03:54:14',
                'updated_at' => '2017-10-26 03:54:14',
            ),
        );
        
        DB::table('tags')->insert($tags);

        
        $taggables = array(
            array( // row #0
                'id' => 4,
                'tag_id' => 1,
                'taggable_type' => 'App\\Models\\Album',
                'taggable_id' => 2,
                'created_at' => NULL,
                'updated_at' => NULL,
            ),
            array( // row #1
                'id' => 5,
                'tag_id' => 2,
                'taggable_type' => 'App\\Models\\Album',
                'taggable_id' => 2,
                'created_at' => NULL,
                'updated_at' => NULL,
            ),
            array( // row #2
                'id' => 6,
                'tag_id' => 3,
                'taggable_type' => 'App\\Models\\Album',
                'taggable_id' => 2,
                'created_at' => NULL,
                'updated_at' => NULL,
            ),
            array( // row #3
                'id' => 7,
                'tag_id' => 4,
                'taggable_type' => 'App\\Models\\Album',
                'taggable_id' => 2,
                'created_at' => NULL,
                'updated_at' => NULL,
            ),
            array( // row #4
                'id' => 8,
                'tag_id' => 1,
                'taggable_type' => 'App\\Models\\Album',
                'taggable_id' => 3,
                'created_at' => NULL,
                'updated_at' => NULL,
            ),
            array( // row #5
                'id' => 9,
                'tag_id' => 2,
                'taggable_type' => 'App\\Models\\Album',
                'taggable_id' => 3,
                'created_at' => NULL,
                'updated_at' => NULL,
            ),
            array( // row #6
                'id' => 10,
                'tag_id' => 3,
                'taggable_type' => 'App\\Models\\Album',
                'taggable_id' => 3,
                'created_at' => NULL,
                'updated_at' => NULL,
            ),
            array( // row #7
                'id' => 11,
                'tag_id' => 3,
                'taggable_type' => 'App\\Models\\Album',
                'taggable_id' => 4,
                'created_at' => NULL,
                'updated_at' => NULL,
            ),
            array( // row #8
                'id' => 12,
                'tag_id' => 5,
                'taggable_type' => 'App\\Models\\Album',
                'taggable_id' => 4,
                'created_at' => NULL,
                'updated_at' => NULL,
            ),
            array( // row #9
                'id' => 13,
                'tag_id' => 6,
                'taggable_type' => 'App\\Models\\Album',
                'taggable_id' => 4,
                'created_at' => NULL,
                'updated_at' => NULL,
            ),
            array( // row #10
                'id' => 14,
                'tag_id' => 3,
                'taggable_type' => 'App\\Models\\Album',
                'taggable_id' => 5,
                'created_at' => NULL,
                'updated_at' => NULL,
            ),
            array( // row #11
                'id' => 15,
                'tag_id' => 7,
                'taggable_type' => 'App\\Models\\Album',
                'taggable_id' => 5,
                'created_at' => NULL,
                'updated_at' => NULL,
            ),
            array( // row #12
                'id' => 16,
                'tag_id' => 8,
                'taggable_type' => 'App\\Models\\Album',
                'taggable_id' => 5,
                'created_at' => NULL,
                'updated_at' => NULL,
            ),
            array( // row #13
                'id' => 17,
                'tag_id' => 9,
                'taggable_type' => 'App\\Models\\Album',
                'taggable_id' => 5,
                'created_at' => NULL,
                'updated_at' => NULL,
            ),
            array( // row #14
                'id' => 18,
                'tag_id' => 8,
                'taggable_type' => 'App\\Models\\Album',
                'taggable_id' => 6,
                'created_at' => NULL,
                'updated_at' => NULL,
            ),
            array( // row #15
                'id' => 19,
                'tag_id' => 10,
                'taggable_type' => 'App\\Models\\Album',
                'taggable_id' => 6,
                'created_at' => NULL,
                'updated_at' => NULL,
            ),
            array( // row #16
                'id' => 20,
                'tag_id' => 8,
                'taggable_type' => 'App\\Models\\Album',
                'taggable_id' => 7,
                'created_at' => NULL,
                'updated_at' => NULL,
            ),
            array( // row #17
                'id' => 21,
                'tag_id' => 10,
                'taggable_type' => 'App\\Models\\Album',
                'taggable_id' => 7,
                'created_at' => NULL,
                'updated_at' => NULL,
            ),
            array( // row #18
                'id' => 22,
                'tag_id' => 11,
                'taggable_type' => 'App\\Models\\Album',
                'taggable_id' => 7,
                'created_at' => NULL,
                'updated_at' => NULL,
            ),
            array( // row #19
                'id' => 23,
                'tag_id' => 9,
                'taggable_type' => 'App\\Models\\Album',
                'taggable_id' => 8,
                'created_at' => NULL,
                'updated_at' => NULL,
            ),
            array( // row #20
                'id' => 24,
                'tag_id' => 11,
                'taggable_type' => 'App\\Models\\Album',
                'taggable_id' => 8,
                'created_at' => NULL,
                'updated_at' => NULL,
            ),
            array( // row #21
                'id' => 25,
                'tag_id' => 12,
                'taggable_type' => 'App\\Models\\Album',
                'taggable_id' => 8,
                'created_at' => NULL,
                'updated_at' => NULL,
            ),
            array( // row #22
                'id' => 26,
                'tag_id' => 10,
                'taggable_type' => 'App\\Models\\Album',
                'taggable_id' => 9,
                'created_at' => NULL,
                'updated_at' => NULL,
            ),
            array( // row #23
                'id' => 27,
                'tag_id' => 13,
                'taggable_type' => 'App\\Models\\Album',
                'taggable_id' => 9,
                'created_at' => NULL,
                'updated_at' => NULL,
            ),
            array( // row #24
                'id' => 28,
                'tag_id' => 14,
                'taggable_type' => 'App\\Models\\Album',
                'taggable_id' => 9,
                'created_at' => NULL,
                'updated_at' => NULL,
            ),
            array( // row #25
                'id' => 29,
                'tag_id' => 15,
                'taggable_type' => 'App\\Models\\Album',
                'taggable_id' => 9,
                'created_at' => NULL,
                'updated_at' => NULL,
            ),
            array( // row #26
                'id' => 30,
                'tag_id' => 9,
                'taggable_type' => 'App\\Models\\Album',
                'taggable_id' => 10,
                'created_at' => NULL,
                'updated_at' => NULL,
            ),
            array( // row #27
                'id' => 31,
                'tag_id' => 14,
                'taggable_type' => 'App\\Models\\Album',
                'taggable_id' => 10,
                'created_at' => NULL,
                'updated_at' => NULL,
            ),
            array( // row #28
                'id' => 32,
                'tag_id' => 16,
                'taggable_type' => 'App\\Models\\Album',
                'taggable_id' => 10,
                'created_at' => NULL,
                'updated_at' => NULL,
            ),
            array( // row #29
                'id' => 33,
                'tag_id' => 17,
                'taggable_type' => 'App\\Models\\Album',
                'taggable_id' => 10,
                'created_at' => NULL,
                'updated_at' => NULL,
            ),
            array( // row #30
                'id' => 34,
                'tag_id' => 18,
                'taggable_type' => 'App\\Models\\Album',
                'taggable_id' => 11,
                'created_at' => NULL,
                'updated_at' => NULL,
            ),
            array( // row #31
                'id' => 35,
                'tag_id' => 19,
                'taggable_type' => 'App\\Models\\Album',
                'taggable_id' => 11,
                'created_at' => NULL,
                'updated_at' => NULL,
            ),
            array( // row #32
                'id' => 36,
                'tag_id' => 11,
                'taggable_type' => 'App\\Models\\Album',
                'taggable_id' => 12,
                'created_at' => NULL,
                'updated_at' => NULL,
            ),
            array( // row #33
                'id' => 37,
                'tag_id' => 19,
                'taggable_type' => 'App\\Models\\Album',
                'taggable_id' => 12,
                'created_at' => NULL,
                'updated_at' => NULL,
            ),
            array( // row #34
                'id' => 38,
                'tag_id' => 4,
                'taggable_type' => 'App\\Models\\Album',
                'taggable_id' => 13,
                'created_at' => NULL,
                'updated_at' => NULL,
            ),
            array( // row #35
                'id' => 39,
                'tag_id' => 11,
                'taggable_type' => 'App\\Models\\Album',
                'taggable_id' => 13,
                'created_at' => NULL,
                'updated_at' => NULL,
            ),
            array( // row #36
                'id' => 40,
                'tag_id' => 20,
                'taggable_type' => 'App\\Models\\Album',
                'taggable_id' => 13,
                'created_at' => NULL,
                'updated_at' => NULL,
            ),
            array( // row #37
                'id' => 41,
                'tag_id' => 11,
                'taggable_type' => 'App\\Models\\Album',
                'taggable_id' => 14,
                'created_at' => NULL,
                'updated_at' => NULL,
            ),
        );
        
        DB::table('taggables')->insert($taggables);
    }
}
