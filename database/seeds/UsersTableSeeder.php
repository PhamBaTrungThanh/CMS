<?php

use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->insert([
            'name' => 'Arthur',
            'email' => 'admin@mazui.photography',
            'password' => bcrypt('secret'),
            'role' => 'admin',

        ]);
    }
}
