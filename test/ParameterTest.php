<?php

require_once('lib/bootstrap.php');

use Kirby\Plugins\ImageSet\ImageSet;

class ParameterTest extends ImageSetTestCase {

  public $kirby;
  public $site;
  public $testImage;

  public function setUp() {
    $this->kirby     = $this->kirbyInstance();
    $this->site      = $this->siteInstance($this->kirby);
    $this->testImage = $this->site->image();
  }

  // Number as String
  public function testSingleStringValue() {
    $this->assertEquals(200, ImageSet::parseSizesParameter('200'));
  }

  // Number as Integer
  public function testSingleIntegerValue() {
    $this->assertEquals(200, ImageSet::parseSizesParameter('200'));
  }

  // Multiple Sizes as String
  public function testMultipleSizesAsString() {
    $this->assertEquals([200, 400, 600], ImageSet::parseSizesParameter('200,400,600'));
  }

  // [200, 400, 600]
  public function testSimpleArray() {
    $this->assertEquals([200, 400, 600], ImageSet::parseSizesParameter([200, 400, 600]));
  }

  // [0, 400, 600]
  public function testSimpleArrayWithZeroValue() {
    $this->expectException('Exception');
    ImageSet::parseSizesParameter([0, 400, 600]);
  }

  // '200-600'
  public function testRange() {
    $this->assertEquals([200, 334, 467, 600], ImageSet::parseSizesParameter('200-600'));
  }

  // '0-600'
  public function testRangeWithZeroValue() {
    $this->expectException('Exception');
    ImageSet::parseSizesParameter('0-600');
  }
  
  // Different amount of intermediate sizes
  public function testRangeWithIntermediateSizes() {
    $this->assertEquals([200, 300, 400, 500, 600],           ImageSet::parseSizesParameter('200-600,3'));
    $this->assertEquals([200, 280, 360, 440, 520, 600],      ImageSet::parseSizesParameter('200-600,4'));
    $this->assertEquals([200, 267, 334, 400, 467, 534, 600], ImageSet::parseSizesParameter('200-600,5'));
  }

  // Zero Intermediate Sizes
  public function testRangeWithZeroIntermediateSizes() {
    $this->expectException('Exception');
    ImageSet::parseSizesParameter('0-600');
  }

  public function testSingleCropValue() {
    $this->assertEquals(
      [ 'width' => 400, 'height' => 300, 'crop' => true],
      ImageSet::parseSizesParameter('400x300')
    );
  }

  public function testSingleCropValueWithZero() {
    $this->expectException('Exception');
    ImageSet::parseSizesParameter('400x0');
  }

  public function testMultipleCropValues() {
    $this->assertEquals(
      [
        [ 'width' => 400, 'height' => 300, 'crop' => true],
        [ 'width' => 600, 'height' => 200, 'crop' => true],
      ],
      ImageSet::parseSizesParameter('400x300,600x200')
    );
  }

  // 

  // public function

  //public function 

  // public function testSimpleArrayFloatValue() {
  //   $this->expectException('Exception');
  //   ImageSet::parseSizesParameter([200, 400.5, 600]);
  // }
  
}
