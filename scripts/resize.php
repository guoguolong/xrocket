<?php
function resize($folder, $scale_width) {
    if (!is_dir($folder)) return;

    if ($dh = opendir($folder)) {
        $count = 0;
        while (($filename = readdir($dh)) !== false) {
            $full_file_path = $folder . DIRECTORY_SEPARATOR . $filename;
            if ((is_dir($full_file_path)) && $filename != "." && $filename != "..") {
                resize($full_file_path, $scale_width);
            } else {
                $is_png = $is_jpg = false;
                if(preg_match('/\.jpg$/', $full_file_path)) $is_jpg = true;
                if(preg_match('/\.png$/', $full_file_path)) $is_png = true;

                if($is_jpg || $is_png) {
                    list($width, $height) = getimagesize($full_file_path);
                    $scale_height = round($scale_width * $height / $width);  
                    $to_image = imagecreatetruecolor($scale_width, $scale_height);

                    $im;
                    if ($is_jpg) {
                        $im = imagecreatefromjpeg($full_file_path);
                        $color = imagecolorallocate($to_image, 255, 255, 255);
                        imagefill($to_image, 0, 0, $color);
                    } else {
                        $im = imagecreatefrompng($full_file_path);
                        imagealphablending($to_image, false);
                        $color = imagecolorallocatealpha($to_image, 0, 0, 0, 127);
                        imagefill($to_image, 0, 0, $color);
                        imagesavealpha($to_image, true);
                    }
                    imagecopyresampled($to_image, $im, 0, 0, 0, 0, $scale_width, $scale_height, $width, $height);
                    if ($is_jpg) {
                        imagejpeg($to_image, $full_file_path);
                    } else {
                        imagepng($to_image, $full_file_path);
                    }
                    echo $full_file_path . " done.\r\n";
                }
            }
        }
        closedir($dh);
    }

    if (count(scandir($folder)) <= 2) {
        if ($rm_folder) rmdir($folder);
    }
}

resize('../data/catalog-thumbnails', 400);