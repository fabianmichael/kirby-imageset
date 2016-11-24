<style>
.imageset-license-box {
  display: flex;
  align-items: center;
}

.imageset-license-box a {
  font-weight: 600;
  white-space: nowrap;
}
.imageset-license-box a:after {
  content: "›";
  padding-left: .25em;
}
</style>
<div class="imageset-box imageset-license-box">
  <div style="padding: 0 1em 0 0;">
    <span class="fa fa-warning fa-2x"></span>
  </div>
  <div class="text">
    <?php echo $text ?>
  </div>
</div>
