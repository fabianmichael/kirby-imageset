<?php

require_once('lib/bootstrap.php');

use Kirby\Plugins\ImageSet\ImageSet;
use Kirby\Plugins\ImageSet\Utils;

class UtilsTest extends ImageSetTestCase {

  public function testIsArrayAssoc() {
    $this->assertTrue(Utils::isArrayAssoc(['a' => 2, 'b' => 'hello world']));
    $this->assertTrue(Utils::isArrayAssoc([0 => 'a', 'b' => 'hello world']));
    $this->assertTrue(Utils::isArrayAssoc([0, 'a', 'b' => 'hello world']));
    $this->assertFalse(Utils::isArrayAssoc(['a', 'b']));
    $this->assertFalse(Utils::isArrayAssoc([0 => 'a', 1 => 'b']));
  }

  public function testIsArraySequesntial() {
    $this->assertFalse(Utils::isArraySequential(['a' => 2, 'b' => 'hello world']));
    $this->assertFalse(Utils::isArraySequential([0 => 'a', 'b' => 'hello world']));
    $this->assertFalse(Utils::isArraySequential([0, 'a', 'b' => 'hello world']));
    $this->assertTrue(Utils::isArraySequential(['a', 'b']));
    $this->assertTrue(Utils::isArraySequential([0 => 'a', 1 => 'b']));
  }

  public function testFormatFloat() {
    $this->assertEquals('0.56787543', Utils::formatFloat(0.56787543252353));
    $this->assertEquals('0.568', Utils::formatFloat(0.56787543252353, 3));
  }

  public function testCompareFloats() {
    $this->assertTrue(Utils::compareFloats(0.1, 0.2, 0));
    $this->assertTrue(Utils::compareFloats(0.11, 0.12, 1));
    $this->assertFalse(Utils::compareFloats(0.11, 0.12, 2));
    $this->assertTrue(Utils::compareFloats(0.12345, 0.12346));
    $this->assertTrue(Utils::compareFloats(0.12345, 0.12346, 4));
    $this->assertFalse(Utils::compareFloats(0.12345, 0.12346, 5));
  }

  public function testTransparency() {

    $home = $this->siteInstance()->page('home');

    $this->assertTrue(Utils::hasTransparency($home->image('transparency-1bit.gif'), false));
    $this->assertTrue(Utils::hasTransparency($home->image('transparency-1bit.png'), false));
    $this->assertTrue(Utils::hasTransparency($home->image('transparency-4bit.png'), false));
    $this->assertTrue(Utils::hasTransparency($home->image('transparency-8bit.png'), false));

  }
}
